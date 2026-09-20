export {};
interface QAState {
  sdkLoaded: boolean;
  viewWhenResolved: boolean;
  layerLoaded: boolean;
  restQuerySucceeded: boolean;
  featureCount: number;
  containerWidth: number;
  containerHeight: number;
  error: string | null;
}

declare global {
  interface Window {
    __ARCGIS_QA__: QAState;
    require: any;
  }
}

window.__ARCGIS_QA__ = {
  sdkLoaded: false,
  viewWhenResolved: false,
  layerLoaded: false,
  restQuerySucceeded: false,
  featureCount: 0,
  containerWidth: 0,
  containerHeight: 0,
  error: null
};

const sdkBadge = document.getElementById('sdk-status');
const viewBadge = document.getElementById('view-status');
const layerBadge = document.getElementById('layer-status');
const queryBadge = document.getElementById('query-status');
const countBadge = document.getElementById('feature-count');
const dimBadge = document.getElementById('dimensions');

function loadArcGISModules(): Promise<{ Map: any; MapView: any; FeatureLayer: any }> {
  return new Promise((resolve, reject) => {
    if (typeof window.require === 'function') {
      window.require(
        ['esri/Map', 'esri/views/MapView', 'esri/layers/FeatureLayer'],
        (Map: any, MapView: any, FeatureLayer: any) => {
          resolve({ Map, MapView, FeatureLayer });
        },
        (err: any) => reject(err)
      );
    } else {
      reject(new Error('ArcGIS Maps SDK require not found on window'));
    }
  });
}

async function init() {
  try {
    const { Map, MapView, FeatureLayer } = await loadArcGISModules();
    window.__ARCGIS_QA__.sdkLoaded = true;
    if (sdkBadge) {
      sdkBadge.textContent = 'LOADED';
      sdkBadge.className = 'badge success';
    }

    const layer = new FeatureLayer({
      url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties_Generalized_Boundaries/FeatureServer/0',
      title: 'USA Counties - Generalized'
    });

    const map = new Map({
      basemap: 'osm',
      layers: [layer]
    });

    const view = new MapView({
      container: 'viewDiv',
      map: map,
      center: [-98.5795, 39.8283],
      zoom: 4
    });

    // 1. FeatureLayer.load()
    await layer.load();
    window.__ARCGIS_QA__.layerLoaded = true;
    if (layerBadge) {
      layerBadge.textContent = 'LOADED';
      layerBadge.className = 'badge success';
    }

    // 2. queryFeatureCount()
    const query = layer.createQuery();
    query.where = '1=1';
    const count = await layer.queryFeatureCount(query);
    window.__ARCGIS_QA__.restQuerySucceeded = true;
    window.__ARCGIS_QA__.featureCount = count;
    if (queryBadge && countBadge) {
      queryBadge.textContent = 'SUCCEEDED';
      queryBadge.className = 'badge success';
      countBadge.textContent = count.toString();
      countBadge.className = 'badge success';
    }

    // 3. view.when()
    await view.when();
    window.__ARCGIS_QA__.viewWhenResolved = true;
    if (viewBadge) {
      viewBadge.textContent = 'RESOLVED';
      viewBadge.className = 'badge success';
    }

    // 4. MapView container dimensions
    const container = document.getElementById('viewDiv');
    const width = container ? container.clientWidth : view.width;
    const height = container ? container.clientHeight : view.height;
    window.__ARCGIS_QA__.containerWidth = width;
    window.__ARCGIS_QA__.containerHeight = height;

    if (dimBadge) {
      dimBadge.textContent = `${width}px x ${height}px`;
      if (width > 0 && height > 0) {
        dimBadge.className = 'badge success';
      }
    }

    console.log('[ARCGIS_QA] MapView initialized successfully. QA State:', window.__ARCGIS_QA__);
  } catch (err: any) {
    console.error('[ARCGIS_QA ERROR]', err);
    window.__ARCGIS_QA__.error = err?.message || String(err);
    if (viewBadge) {
      viewBadge.textContent = 'ERROR';
      viewBadge.className = 'badge error';
    }
  }
}

init();
