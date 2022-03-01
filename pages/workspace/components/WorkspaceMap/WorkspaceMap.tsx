import { getCentroidFromCoordinates } from "pages/configurator/components/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMapGL, { InteractiveMap, PointerEvent, ViewportProps } from "react-map-gl";
import { ProjectLayers } from "./ProjectLayers/ProjectLayers";
import { MapControls } from "./MapControls/MapControls";
import { DrawLayer } from "./DrawLayer/DrawLayer";
import { Feature } from "geojson";
import { CreateProject } from "./Cards/CreateProject/CreateProject";
import { SiteDetail } from "./Cards/SiteDetail/SiteDetail";
import { useProjectStore } from "stores/projectStore";
import { useWorkspaceStore } from "stores/workspaceStore";
import { getWorkspaceCoordinates } from "pages/workspace/utils/mapUtils";
import { GetStarted } from "./Cards/GetStarted/GetStarted";
import { useMapStore } from "stores/mapStore";
import localStorageService from "localStorage/localStorageService";
import { LocalStorgeKey } from "localStorage/type";
import { MapSearch } from "./Cards/MapSearch/MapSearch";
import MasterplanLayers from "./MasterplanLayers";
import SatelliteLayer from "./SatelliteLayer";
import classes from "./WorkspaceMap.module.scss";
import { BuildingLayer3D } from "./BuildingLayer3D/BuildingLayer3D";
import { mapConfig } from "utils/mapConstants";
import WorkspacePrompt from "pages/workspace/components/WorkspaceMap/WorkspacePrompt";
import { EsriFeatureLayer } from "pages/workspace/components/WorkspaceMap/EsriFeatureLayer";
import { LngLatBounds } from "mapbox-gl";
import { debounce } from "lodash-es";
import * as turf from "@turf/turf";
import { SelectedGeometryLayer } from "./SelectedGeometryLayer/SelectedGeometryLayer";
import { MapLayerIds } from "types/map";

type Props = {
  workspaceId: string;
  hoveredProjectId?: string | undefined;
  isPreview?: boolean;
};

export const WorkspaceMap = ({ workspaceId, isPreview, hoveredProjectId }: Props) => {
  const [projectStore] = useProjectStore();
  const [workspaceStore] = useWorkspaceStore();
  const [mapStore, mapActions] = useMapStore();

  const [newSiteSelected, setNewSiteSelected] = useState<Feature | undefined>();
  const [selectedFeature, setSelectedFeature] = useState<
    { feature: mapboxgl.MapboxGeoJSONFeature; point: [number, number] } | undefined
  >();

  const [isDrawLayerActive, setIsDrawLayerActive] = useState(false);

  const mapRef = useRef<InteractiveMap | null>(null);
  const [viewport, setViewport] = useState<Partial<ViewportProps>>();
  const [currentBounds, setCurrentBounds] = useState<LngLatBounds | undefined>();
  const [clickedFeatures, setClickedFeatures] = useState<Array<Feature>>([]);

  useEffect(() => {
    const showGetStartedCard = localStorageService.getLocalStorageItem(LocalStorgeKey.show_get_started);

    if (!showGetStartedCard || (showGetStartedCard && JSON.parse(showGetStartedCard) === true)) {
      mapActions.setShowGetStartedCard(true);
    }
  }, [mapActions]);

  useEffect(() => {
    if (projectStore.projects.length === 0) {
      return;
    }
    const workspaceCoordinates = getWorkspaceCoordinates(projectStore.projects);
    setViewport((current) => ({ ...current, ...workspaceCoordinates, zoom: 15 }));
  }, [projectStore.projects]);

  const projectLayerId = "projects";

  const deselectIfNoFeature = (event: PointerEvent) => {
    const features = mapRef.current?.queryRenderedFeatures(event.point);

    // Check if any feature "that we care about" has been clicked, otherwise deselect.
    // Use layer id to distinguish between our layers vs mapbox base layers
    // e.g. for buildings, labels and roads
    if (!features || features.filter((f) => f.properties?.type === projectLayerId).length === 0) {
      setSelectedFeature(undefined);
    }
  };

  const setTheFeature = (feature, altLngLat) => {
    const center = getCentroidFromCoordinates(feature.geometry.coordinates[0]);
    setSelectedFeature({
      feature,
      point: center ? [center[0], center[1]] : altLngLat
    });
  };

  useEffect(() => {
    const features = mapRef.current?.queryRenderedFeatures();
    if (hoveredProjectId && features) {
      features
        ?.filter((feature) => !feature.sourceLayer && feature.source)
        .forEach((feature) => {
          if (feature && feature.source === hoveredProjectId && feature.geometry.type === "Polygon") {
            setTheFeature(feature, [0, 0]);
          }
        });
    } else {
      setSelectedFeature(undefined);
    }
  }, [hoveredProjectId]);

  useEffect(() => {
    setIsDrawLayerActive(projectStore.activeProjectId !== "");
  }, [projectStore.activeProjectId]);

  const selectFeature = (event: PointerEvent) => {
    if (isDrawLayerActive && !isPreview) {
      return;
    }

    const features = mapRef.current?.queryRenderedFeatures(event.point);
    features
      ?.filter((feature) => !feature.sourceLayer && feature.source)
      .forEach((feature) => {
        if (
          mapActions.getMapLayer(feature.properties?.layerId)?.isOn &&
          selectedFeature?.feature.source !== feature.source &&
          feature.geometry.type === "Polygon"
        ) {
          setTheFeature(feature, event.lngLat);
        }
      });
  };

  const handleProjectFeatureDeselected = () => {
    setSelectedFeature(undefined);
  };

  const handleControlClick = (viewProps: Partial<ViewportProps>) => {
    setViewport(viewProps);
  };

  const handleSiteSelected = (feature?: Feature) => {
    setNewSiteSelected(feature);
    mapActions.setShowSiteDetailModal(feature != null);
  };

  const handleLayerToggle = (layerId: string) => {
    mapActions.toggleMapLayer(layerId);
  };

  const updateCurrentBounds = useCallback(
    debounce(() => {
      if (mapRef?.current) {
        const bounds = mapRef.current.getMap().getBounds();
        setCurrentBounds(bounds);
      }
    }, 500),
    []
  );

  const updateViewport = useCallback(
    (nextViewport: Partial<ViewportProps>) => {
      setViewport(nextViewport);
      updateCurrentBounds();
    },
    [updateCurrentBounds]
  );

  const handleDrawLayerActiveChanged = useCallback((isActive: boolean) => {
    setIsDrawLayerActive(isActive);
  }, []);

  const geocoderContainerRef = useRef(null);

  useEffect(() => {
    if (clickedFeatures.length === 1) {
      setCombinedGeometryFeature(clickedFeatures[0]);
      return;
    }

    let polyAry: Array<any> = [];

    clickedFeatures.forEach((f) => {
      let turfPol = turf.polygon(f.geometry["coordinates"], { fill: "#0f0", layerId: "combinedPoly" });
      polyAry.push(turfPol);
    });

    if (polyAry.length > 0) {
      var union = turf.union(...polyAry);
      setCombinedGeometryFeature(union as Feature);
    } else {
      setCombinedGeometryFeature(undefined);
    }
  }, [clickedFeatures]);

  const addToClickedList = (feature: Feature, selectSingleFeature: boolean = false) => {
    let currentFeatures = [...clickedFeatures];
    const index = currentFeatures.findIndex((f) => f.properties!["planlabel"] === feature.properties!["planlabel"]);

    if (index === -1) {
      if (selectSingleFeature === true) {
        currentFeatures = [];
      }
      currentFeatures.push(feature);
    } else {
      currentFeatures.splice(index, 1);
    }

    setClickedFeatures(currentFeatures);
  };

  const [combinedGeometryFeature, setCombinedGeometryFeature] = useState<Feature>();

  const handleMapClick = (e: PointerEvent) => {
    const features = mapRef.current?.queryRenderedFeatures(e.point);
    const parcelFeatures = features ? features.filter((f) => f.layer.id === MapLayerIds.ParcelSelection) : [];

    if (parcelFeatures.length > 0) {
      parcelFeatures.forEach((f) => {
        addToClickedList(f, true);
      });
    }
  };

  return (
    <div className={classes.workspaceMapWrapper}>
      <div ref={geocoderContainerRef} className={classes.geoCoderContainer} />
      <ReactMapGL
        width={"auto"}
        style={{ minWidth: "100%" }} //have to do this here or inline styles auto override it
        height={"100%"}
        ref={mapRef}
        mapStyle={`${mapConfig.mapStyleBaseUrl}/${mapConfig.user}/${mapConfig.styles.basic}?access_token=${mapConfig.token}`}
        mapboxApiAccessToken={mapConfig.token}
        {...viewport}
        onNativeClick={deselectIfNoFeature}
        onHover={selectFeature}
        onViewportChange={updateViewport}
        onMouseOut={deselectIfNoFeature}
        onClick={handleMapClick}
      >
        <CreateProject
          workspace={{
            id: workspaceStore.selectedWorkspaceId,
            name: workspaceStore.selectedWorkSpace
          }}
          selectedSite={newSiteSelected}
          isDisplayed={mapStore.showCreateProjectModal}
        />

        <BuildingLayer3D />

        <SatelliteLayer />

        {!isPreview && <MasterplanLayers />}

        <SelectedGeometryLayer combinedGeometry={combinedGeometryFeature} />
        <EsriFeatureLayer bounds={currentBounds} />

        <ProjectLayers
          layerId={projectLayerId}
          selectedFeature={selectedFeature}
          onDeselectFeature={handleProjectFeatureDeselected}
          workspaceId={workspaceId}
          projectListHoveredId={hoveredProjectId}
        />

        {!isPreview && (
          <>
            <SiteDetail selectedSite={newSiteSelected} />
            <MapSearch
              mapRef={mapRef}
              onViewportChange={updateViewport}
              mapToken={mapConfig.token}
              containerRef={geocoderContainerRef}
            />
            <GetStarted isDisplayed={mapStore.showGetStartedCard && !projectStore.activeProjectId} />
            <DrawLayer onSiteSelected={handleSiteSelected} onIsLayerActiveChanged={handleDrawLayerActiveChanged} />
            <WorkspacePrompt />
          </>
        )}

        <MapControls viewport={viewport} onViewPortChange={handleControlClick} />
      </ReactMapGL>
    </div>
  );
};
