select 
    aux.lat,
	aux.lng,
	MAX(PotencyFrequencies.potency) as count
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
			id = 1 
		) as aux, Coordinates
    where
        Coordinates.PlaceId = aux.id
	) as aux, PotencyFrequencies
where
    PotencyFrequencies.CoordinateId = aux.id and PotencyFrequencies.frequency between 500000 and 600000
group by lat , lng
order by count desc