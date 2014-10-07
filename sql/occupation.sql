select 
    frequency / 1000 as frequency,
    SUM(case
        when potency > -90 then 1
        else 0
    END) / COUNT(*) as total
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
	) as aux, PotencyFrequencies
where
    aux.id = PotencyFrequencies.CoordinateId
group by frequency