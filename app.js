document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([25.325366, 55.388962], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
    }).addTo(map);

    const alMajaz = L.marker([25.325366, 55.388962], {
        icon: L.icon({ iconUrl: 'mb.png', iconSize: [40, 40] })
    }).addTo(map);

    // Add neighborhood markers
    const neighborhoods = {
        'Al Nahda': [25.303810, 55.377176],
        'Al Majaz': [25.325366, 55.388962],
        'Al Gharb': [25.357424, 55.390659],
        'Al Qasimiah': [25.346412, 55.397981],
        'Al Sharq': [25.366859, 55.402760],
        'Al Seneyat': [25.305378, 55.409551],
        'Al Jazeera': [25.3331, 55.3712],
        'Tugariet Muwaileh': [25.300143, 55.449436],
        'Al Riqah': [25.370377, 55.435854],
        'Halwan': [25.347588, 55.420762],
        'Al Hyrah': [25.383965, 55.418875],
        'Mughaider': [25.333775, 55.444415],
        'Wasit': [25.355857, 55.461474],
        'Muwailah': [25.291568, 55.509201],
        'Al Sajaah': [25.325954, 55.645404],
        'Al Ruqa Al Hamra': [25.340257, 55.514411],
        'University City': [25.299825, 55.483680],
        'Rahmaniyah': [25.337645, 55.580006],
        'Basaten Al Zubair': [25.382798, 55.618032],
        'Khalid Sea Port': [25.360974, 55.377697],
        'Al Siyuh': [25.244771, 55.619020],
        'Al Zubair': [25.375363, 55.685522],
        'Kaya Masaar': [25.2676, 55.6412],
        'Al Jlail': [25.337645, 55.448205],
        'Al Batayih': [25.207617, 55.732370],
        'Jweza': [25.2729, 55.6079],
        'Mehathab': [25.4047, 55.6424],
        'Al Tayy': [25.241847, 55.582719],
        'Al Sidairah': [25.351180, 55.691388]
    };

    Object.entries(neighborhoods).forEach(([name, [lat, lng]]) => {
        L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'neighborhood-marker',
                html: `<div style="background-color: ${getColorForScore(randomScore())};">${name}</div>`
            })
        }).addTo(map).on('click', () => {
            alert(`${name}: Crime Score ${randomScore()}`);
        });
    });

    function getColorForScore(score) {
        switch (score) {
            case 1: return 'green';
            case 2: return 'lightgreen';
            case 3: return 'yellow';
            case 4: return 'orange';
            case 5: return 'red';
            default: return 'grey';
        }
    }

    function randomScore() {
        return Math.floor(Math.random() * 5) + 1;
    }

    // Add crime data
    const crimeData = [
        { type: 'Theft', time: '2:30 PM', lat: 25.3266, lng: 55.3854 },
        { type: 'Vandalism', time: '11:45 AM', lat: 25.3270, lng: 55.3850 },
        { type: 'Disturbance', time: '9:15 AM', lat: 25.3260, lng: 55.3860 }
    ];

    const crimeList = document.getElementById('crime-list');
    crimeData.forEach(crime => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${crime.type}</strong> - ${crime.time}`;
        crimeList.appendChild(li);
    });

    // Handle search
    document.getElementById('search').addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const query = event.target.value.toLowerCase();
            const neighborhood = Object.keys(neighborhoods).find(name => name.toLowerCase() === query);

            if (neighborhood) {
                const [lat, lng] = neighborhoods[neighborhood];
                map.setView([lat, lng], 14);
                L.marker([lat, lng], {
                    icon: L.icon({ iconUrl: 'mr.png', iconSize: [40, 40] })
                }).addTo(map);
            } else {
                alert('Neighborhood not found.');
            }
        }
    });

    // Handle get directions button
    document.getElementById('get-directions').addEventListener('click', () => {
        const searchInput = document.getElementById('search').value.toLowerCase();
        const destination = Object.keys(neighborhoods).find(name => name.toLowerCase() === searchInput);

        if (destination) {
            const [destLat, destLng] = neighborhoods[destination];
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    const { latitude, longitude } = position.coords;
                    L.Routing.control({
                        waypoints: [
                            L.latLng(latitude, longitude),
                            L.latLng(destLat, destLng)
                        ],
                        routeWhileDragging: true,
                        geocoder: L.Control.Geocoder.nominatim()
                    }).addTo(map);
                }, () => {
                    alert('Unable to retrieve your location.');
                });
            } else {
                alert('Geolocation is not supported by this browser.');
            }
        } else {
            alert('Destination not found.');
        }
    });

    document.getElementById('emergency').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;

                // Show red marker at user's location
                L.marker([latitude, longitude], {
                    icon: L.icon({
                        iconUrl: 'mr.png', // Red emergency icon
                        iconSize: [50, 50]
                    })
                }).addTo(map);

                alert('Authorites have been alerted the are arriving at your location!!');

            }, () => {
                alert('Unable to retrieve your location.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });
});
