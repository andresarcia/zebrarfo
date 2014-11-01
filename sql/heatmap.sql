select 
    aux.lat,
	aux.lng,
	AVG(PowerFrequencies.power) as count
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
    PowerFrequencies.CoordinateId = aux.id and PowerFrequencies.frequency between 500000 and 600000
group by lat , lng
order by count desc