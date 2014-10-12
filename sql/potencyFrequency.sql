select
	frequency,
	power
from
	(select
		id
	from
		Coordinates
	where
		PlaceId = 1 and id = 500
	) as aux, PowerFrequencies
where
	CoordinateId = aux.id