// 访问者追踪系统
(async function() {
  try {
    // 1. 初始化地图
    const map = L.map('visitor-map').setView([20, 0], 2);
    
    // 添加地图瓦片
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    // 2. 获取用户IP地理信息
    const geoData = await fetchIPGeolocation();
    
    if (!geoData) {
      console.error('Failed to get geolocation data');
      return;
    }

    // 3. 获取历史访问数据
    const visitorsData = await fetchVisitorsData();
    
    // 4. 聚合城市数据
    const citiesAggregated = aggregateCitiesByCoordinates(visitorsData);
    
    // 5. 在地图上绘制标记
    drawMarkersOnMap(map, citiesAggregated);
    
    // 6. 添加当前用户的标记
    if (geoData.latitude && geoData.longitude) {
      L.circleMarker([geoData.latitude, geoData.longitude], {
        radius: 6,
        fillColor: '#FF6B6B',
        color: '#FF6B6B',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.6,
        dashArray: '5, 5'
      }).addTo(map).bindPopup(`<strong>You are here!</strong><br/>${geoData.city}, ${geoData.country}`);
    }
    
    // 7. 显示总访问者数
    updateVisitorCount(visitorsData);
    
    // 8. 发送访问记录到后端（异步，不阻塞页面）
    trackVisitToBackend(geoData);

  } catch (error) {
    console.error('Visitor tracker error:', error);
  }
})();

/**
 * 获取用户IP地理信息
 * 使用 ipify + ipstack 组合（更稳定）
 * 备用方案：使用 ip-api.com
 */
async function fetchIPGeolocation() {
  try {
    // 方案1: 使用 ipapi.co (更稳定，支持CORS)
    console.log('尝试使用ipapi.co获取地理信息...');
    const response = await fetch('https://ipapi.co/json/');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ 从ipapi.co获取数据成功');
      
      return {
        ip: data.ip,
        country: data.country_name || 'Unknown',
        countryCode: data.country_code || '',
        city: data.city || 'Unknown',
        latitude: parseFloat(data.latitude) || 0,
        longitude: parseFloat(data.longitude) || 0,
      };
    }
  } catch (error1) {
    console.warn('ipapi.co 失败，尝试备用方案...', error1);
    
    // 备用方案2: 使用 ip-api.com
    try {
      console.log('尝试使用ip-api.com...');
      const response = await fetch('https://ip-api.com/json/?fields=status,country,countryCode,city,lat,lon,query');
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.status === 'success') {
          console.log('✅ 从ip-api.com获取数据成功');
          
          return {
            ip: data.query,
            country: data.country,
            countryCode: data.countryCode,
            city: data.city || 'Unknown',
            latitude: data.lat,
            longitude: data.lon,
          };
        }
      }
    } catch (error2) {
      console.warn('ip-api.com 也失败了', error2);
    }
  }
  
  // 如果所有方案都失败，返回默认值（中国杭州）
  console.warn('无法获取地理信息，使用默认值');
  return {
    ip: 'unknown',
    country: 'China',
    countryCode: 'CN',
    city: 'Hangzhou',
    latitude: 30.2741,
    longitude: 120.1551,
  };
}

/**
 * 从GitHub Gist获取访问者历史数据
 */
async function fetchVisitorsData() {
  try {
    const GIST_ID = '{{ site.author.github }}' === '{{ site.author.github }}' 
      ? 'YOUR_GIST_ID' // 需要用户填入
      : null;
    
    // 这里需要替换为实际的Gist ID
    // 建议在_config.yml中添加一个配置项
    const gistUrl = `https://gist.githubusercontent.com/YultheConkor/fb482c761a3279b3516a1df26364138a/raw/`;
    
    try {
      const response = await fetch(gistUrl);
      if (response.ok) {
        const data = await response.json();
        return data.visitors || [];
      }
    } catch (e) {
      console.warn('Could not fetch visitors data from Gist', e);
    }
    
    // 如果无法获取，返回空数组
    return [];
  } catch (error) {
    console.error('Error fetching visitors data:', error);
    return [];
  }
}

/**
 * 根据坐标聚合城市数据
 * 同一城市的多个访问者合并为一个标记
 */
function aggregateCitiesByCoordinates(visitorsData) {
  const citiesMap = new Map();
  
  visitorsData.forEach(visitor => {
    // 使用城市名作为key
    const key = `${visitor.latitude},${visitor.longitude}`;
    
    if (citiesMap.has(key)) {
      const existing = citiesMap.get(key);
      existing.count += 1;
    } else {
      citiesMap.set(key, {
        latitude: visitor.latitude,
        longitude: visitor.longitude,
        city: visitor.city || 'Unknown',
        country: visitor.country || 'Unknown',
        count: 1,
      });
    }
  });
  
  return Array.from(citiesMap.values());
}

/**
 * 在地图上绘制圆形标记
 * 标记大小根据访问数量变化
 */
function drawMarkersOnMap(map, citiesData) {
  citiesData.forEach(city => {
    // 计算标记半径（基于访问数量）
    const radius = Math.min(Math.max(5, Math.log(city.count + 1) * 4), 20);
    
    // 计算颜色深度（访问越多越深）
    const intensity = Math.min(city.count / 10, 1);
    const color = interpolateColor('#3388FF', '#FF3333', intensity);
    
    // 创建圆形标记
    const marker = L.circleMarker([city.latitude, city.longitude], {
      radius: radius,
      fillColor: color,
      color: color,
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.6,
    }).addTo(map);
    
    // 添加弹窗信息
    const popupContent = `
      <strong>${city.city}, ${city.country}</strong><br/>
      Visitors: <span style="color: ${color}; font-weight: bold;">${city.count}</span>
    `;
    
    marker.bindPopup(popupContent);
  });
}

/**
 * 颜色插值函数
 * 在两个颜色之间平滑过渡
 */
function interpolateColor(color1, color2, factor) {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);
  
  const r = Math.round(((c1 >> 16) & 0xff) * (1 - factor) + ((c2 >> 16) & 0xff) * factor);
  const g = Math.round(((c1 >> 8) & 0xff) * (1 - factor) + ((c2 >> 8) & 0xff) * factor);
  const b = Math.round((c1 & 0xff) * (1 - factor) + (c2 & 0xff) * factor);
  
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * 更新显示的访问者总数
 */
function updateVisitorCount(visitorsData) {
  const totalCount = visitorsData.length;
  const totalCountries = new Set(visitorsData.map(v => v.country)).size;
  
  document.getElementById('total-visitors').textContent = 
    `Total: ${totalCount} visitors from ${totalCountries} countries`;
}

/**
 * 发送访问记录到Vercel后端
 */
async function trackVisitToBackend(geoData) {
  try {
    // 检查是否已经在这个会话中追踪过
    const sessionKey = 'visitor_tracked_' + new Date().toDateString();
    if (sessionStorage.getItem(sessionKey)) {
      console.log('Already tracked visitor today');
      return;
    }
    
    const response = await fetch('/api/track-visitor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        country: geoData.country,
        city: geoData.city,
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        ip: geoData.ip,
      }),
    });
    
    if (response.ok) {
      console.log('Visitor tracked successfully');
      // 标记已追踪
      sessionStorage.setItem(sessionKey, 'true');
    } else {
      console.warn('Failed to track visitor:', response.statusText);
    }
  } catch (error) {
    // 不中断页面，静默失败
    console.warn('Error tracking visitor:', error);
  }
}
