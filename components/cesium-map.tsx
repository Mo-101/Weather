"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Cesium: any;
  }
}

interface CesiumMapProps {
  onLocationSelect: (lat: number, lon: number, name: string) => void;
}

export default function CesiumMap({
  onLocationSelect,
}: CesiumMapProps) {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCesium = async () => {
      // Load Cesium JS if not already loaded
      if (!window.Cesium) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://cesium.com/downloads/cesiumjs/releases/1.111/Build/Cesium/Cesium.js";
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Cesium"));
          document.head.appendChild(script);
        });
      }

      if (!isMounted || !cesiumContainerRef.current) return;

      // Load Cesium CSS once
      if (!document.querySelector('link[href*="cesium"]')) {
        const cssLink = document.createElement("link");
        cssLink.rel = "stylesheet";
        cssLink.href =
          "https://cesium.com/downloads/cesiumjs/releases/1.111/Build/Cesium/Widgets/widgets.css";
        document.head.appendChild(cssLink);
      }

      // Set Cesium Ion token
      window.Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyNzg0NTE4Mn0.XcKpgANiY19MC4bdFUXMVEBToBmqS8kuYpUlxJHYZxk";

      viewerRef.current = new window.Cesium.Viewer(cesiumContainerRef.current, {
        terrainProvider: window.Cesium.createWorldTerrain(),
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        geocoder: false,
        infoBox: false,
        selectionIndicator: false,
        creditContainer: document.createElement("div"),
        requestRenderMode: true,
        maximumRenderTimeChange: Number.POSITIVE_INFINITY,
      });

      viewerRef.current.camera.setView({
        destination: window.Cesium.Cartesian3.fromDegrees(
          8.6753,
          9.082,
          1500000,
        ),
        orientation: {
          heading: 0.0,
          pitch: -0.3,
          roll: 0.0,
        },
      });

      // Add click handler
      viewerRef.current.cesiumWidget.cesiumContainer.addEventListener(
        "click",
        (event: MouseEvent) => {
          const pickedPosition = viewerRef.current.camera.pickEllipsoid(
            new window.Cesium.Cartesian2(event.clientX, event.clientY),
            viewerRef.current.scene.globe.ellipsoid,
          );
          if (pickedPosition) {
            const cartographic =
              window.Cesium.Cartographic.fromCartesian(pickedPosition);
            const longitude = window.Cesium.Math.toDegrees(
              cartographic.longitude,
            );
            const latitude = window.Cesium.Math.toDegrees(
              cartographic.latitude,
            );
            onLocationSelect(
              latitude,
              longitude,
              `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
            );
          }
        },
      );

      // Add Nigerian cities markers
      const cities = [
        { name: "Lagos", lon: 3.3792, lat: 6.5244 },
        { name: "Abuja", lon: 7.5399, lat: 9.0579 },
        { name: "Kano", lon: 8.5417, lat: 12.0022 },
        { name: "Ibadan", lon: 3.947, lat: 7.3775 },
        { name: "Port Harcourt", lon: 7.0134, lat: 4.8156 },
        { name: "Benin City", lon: 5.6037, lat: 6.335 },
        { name: "Maiduguri", lon: 13.1571, lat: 11.8311 },
        { name: "Zaria", lon: 7.7719, lat: 11.0449 },
        { name: "Aba", lon: 7.3667, lat: 5.1167 },
        { name: "Jos", lon: 8.8965, lat: 9.9285 },
      ];

      cities.forEach((city) => {
        viewerRef.current.entities.add({
          position: window.Cesium.Cartesian3.fromDegrees(city.lon, city.lat),
          point: {
            pixelSize: 15,
            color: window.Cesium.Color.CYAN,
            outlineColor: window.Cesium.Color.WHITE,
            outlineWidth: 3,
            heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
          },
          label: {
            text: city.name,
            font: "14pt sans-serif",
            pixelOffset: new window.Cesium.Cartesian2(0, -50),
            fillColor: window.Cesium.Color.WHITE,
            outlineColor: window.Cesium.Color.BLACK,
            outlineWidth: 2,
            style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
            scale: 1.0,
          },
        });
      });
    };

    loadCesium();

    return () => {
      isMounted = false;
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, [onLocationSelect]);

  return (
    <div ref={cesiumContainerRef} className="w-full h-full absolute inset-0" />
  );
}
