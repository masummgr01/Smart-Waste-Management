import axios from 'axios';

// Simple nearest-neighbor algorithm for route optimization
export const optimizeRouteNearestNeighbor = (pickups, startLocation = null) => {
  if (pickups.length === 0) return [];

  const optimizedRoute = [];
  const unvisited = [...pickups];
  
  // Start from first pickup or provided start location
  let currentLocation = startLocation
    ? { lat: startLocation.lat, lng: startLocation.lng }
    : {
        lat: pickups[0].location.coordinates[1],
        lng: pickups[0].location.coordinates[0],
      };

  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = calculateDistance(
      currentLocation,
      {
        lat: unvisited[0].location.coordinates[1],
        lng: unvisited[0].location.coordinates[0],
      }
    );

    // Find nearest unvisited pickup
    for (let i = 1; i < unvisited.length; i++) {
      const distance = calculateDistance(
        currentLocation,
        {
          lat: unvisited[i].location.coordinates[1],
          lng: unvisited[i].location.coordinates[0],
        }
      );

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    // Add nearest pickup to route
    const nearestPickup = unvisited.splice(nearestIndex, 1)[0];
    optimizedRoute.push({
      pickupId: nearestPickup._id,
      order: optimizedRoute.length + 1,
      location: {
        lat: nearestPickup.location.coordinates[1],
        lng: nearestPickup.location.coordinates[0],
      },
      distance: nearestDistance,
    });

    // Update current location
    currentLocation = {
      lat: nearestPickup.location.coordinates[1],
      lng: nearestPickup.location.coordinates[0],
    };
  }

  // Calculate total distance
  let totalDistance = 0;
  for (let i = 0; i < optimizedRoute.length - 1; i++) {
    totalDistance += calculateDistance(
      optimizedRoute[i].location,
      optimizedRoute[i + 1].location
    );
  }

  return {
    route: optimizedRoute,
    totalDistance: `${(totalDistance / 1000).toFixed(2)}km`,
    totalTime: `${Math.round((totalDistance / 1000) * 2)}min`, // Rough estimate: 2 min per km
  };
};

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (point1, point2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (point1.lat * Math.PI) / 180;
  const φ2 = (point2.lat * Math.PI) / 180;
  const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
  const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) *
      Math.cos(φ2) *
      Math.sin(Δλ / 2) *
      Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Google Directions API optimization (more accurate but requires API key)
export const optimizeRouteGoogle = async (pickups, startLocation = null) => {
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    // Fallback to nearest neighbor if no API key
    return optimizeRouteNearestNeighbor(pickups, startLocation);
  }

  try {
    // Build waypoints
    const waypoints = pickups.map(
      (p) =>
        `${p.location.coordinates[1]},${p.location.coordinates[0]}`
    );

    // Build origin
    const origin = startLocation
      ? `${startLocation.lat},${startLocation.lng}`
      : waypoints[0];

    // Build destination (return to origin or last waypoint)
    const destination = waypoints[waypoints.length - 1];

    // Remove origin from waypoints if it's the first pickup
    const waypointsStr = waypoints.slice(1).join('|');

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/directions/json',
      {
        params: {
          origin,
          destination,
          waypoints: waypointsStr,
          optimize: true, // Google will optimize the route
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (response.data.status !== 'OK') {
      throw new Error('Google Directions API error');
    }

    const route = response.data.routes[0];
    const optimizedWaypointOrder = route.waypoint_order;

    // Reorder pickups based on optimized order
    const optimizedRoute = optimizedWaypointOrder.map((index, order) => {
      const pickup = pickups[index];
      const leg = route.legs[order];
      return {
        pickupId: pickup._id,
        order: order + 1,
        location: {
          lat: pickup.location.coordinates[1],
          lng: pickup.location.coordinates[0],
        },
        distance: leg.distance.value, // in meters
        duration: leg.duration.value, // in seconds
      };
    });

    return {
      route: optimizedRoute,
      totalDistance: route.legs.reduce(
        (sum, leg) => sum + leg.distance.value,
        0
      ) / 1000 + 'km',
      totalTime: route.legs.reduce(
        (sum, leg) => sum + leg.duration.value,
        0
      ) / 60 + 'min',
    };
  } catch (error) {
    console.error('Google Directions API error:', error);
    // Fallback to nearest neighbor
    return optimizeRouteNearestNeighbor(pickups, startLocation);
  }
};

// Main optimize function (uses Google if available, else nearest neighbor)
export const optimizeRoute = async (pickups, startLocation = null) => {
  if (process.env.GOOGLE_MAPS_API_KEY) {
    return await optimizeRouteGoogle(pickups, startLocation);
  } else {
    return optimizeRouteNearestNeighbor(pickups, startLocation);
  }
};




