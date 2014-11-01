select 
    aux.lat,
	aux.lng,
	frequency,
	power
from
    (select 
        Coordinates.latitude as lat,
		Coordinates.longitude as lng,
        Coordinates.id
    from
        (select 
			id
		from
			Places
		where
			id = 16
		) as aux, Coordinates
    where
        Coordinates.PlaceId = aux.id
	) as aux, PowerFrequencies
where
    PowerFrequencies.CoordinateId = aux.id
order by lat and lng