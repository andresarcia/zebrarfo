select 
    frequency,
    power
from
    (select 
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
	) as aux, PowerFrequencies
where aux.id = PowerFrequencies.CoordinateId 
order by frequency