-- Données de départ provenant de la V8.
-- Exécute ce fichier APRÈS schema.sql.

insert into public.destinations
(id,name,region,category,image,description,price,price_value,duration,departure,highlights,offer_id,month,travel_type,badge,active)
values
('cairo','Le Caire','Égypte','afrique','assets/cairo.jpg','Une immersion au cœur du Caire, entre patrimoine millénaire, Nil et ambiance orientale.','À partir de 999 €',999,'8 jours / 7 nuits','Marseille','["Pyramides et patrimoine du Caire","Séjour hôtelier","Transferts selon programme"]','cairo-offer','novembre','Séjour','Coup de cœur',true),
('omra','La Mecque · Médine · Jeddah','Voyage spirituel','spirituel','assets/umrah-combine.jpg','Un voyage spirituel au départ de Marseille, avec un itinéraire combiné incluant Tunis et les villes saintes.','À partir de 1 680 €',1680,'Programme octobre 2026','Marseille','["La Mecque","Médine","Jeddah","Étape à Tunis"]','umrah-offer','octobre','Voyage spirituel','Octobre 2026',true),
('tunisia','Tunisie','Méditerranée','mediterranee','assets/companies.jpg','Préparez votre voyage vers la Tunisie depuis Marseille avec l’accompagnement de l’agence.','Sur demande',null,'Selon programme','Marseille','["Départs depuis Marseille","Conseil personnalisé","Solutions selon disponibilité"]',null,'','Séjour','Sur mesure',true)
on conflict (id) do update set
name=excluded.name,region=excluded.region,category=excluded.category,image=excluded.image,description=excluded.description,price=excluded.price,price_value=excluded.price_value,duration=excluded.duration,departure=excluded.departure,highlights=excluded.highlights,offer_id=excluded.offer_id,month=excluded.month,travel_type=excluded.travel_type,badge=excluded.badge,active=excluded.active;

insert into public.voyages
(id,destination_id,title,subtitle,date,image,price,price_value,duration,departure,text,included,highlights,gallery,badge,active)
values
('cairo-offer','cairo','Le Caire','Égypte · séjour au départ de Marseille','Novembre','assets/cairo.jpg','À partir de 999 €',999,'8 jours / 7 nuits','Marseille','Partez à la découverte du Caire et de son patrimoine exceptionnel lors d’un séjour pensé au départ de Marseille.','["Vol aller-retour selon programme","Hébergement hôtelier","Transferts selon programme","Accompagnement de l’agence avant le départ"]','["Le Caire","Pyramides","Nil","Khan El Khalili"]','["assets/cairo.jpg"]','Coup de cœur',true),
('umrah-offer','omra','Omra combinée','Marseille · Tunis · Terre Sainte','Octobre 2026','assets/umrah-combine.jpg','À partir de 1 680 €',1680,'Programme octobre 2026','Marseille','Un itinéraire spirituel combiné au départ de Marseille, avec une étape à Tunis puis La Mecque, Médine et Jeddah.','["Itinéraire combiné selon programme","Séjour à La Mecque et Médine","Étape à Jeddah","Accompagnement de l’agence avant le départ"]','["La Mecque","Médine","Jeddah","Tunis"]','["assets/umrah-combine.jpg","assets/umrah.jpg"]','Octobre 2026',true)
on conflict (id) do update set
destination_id=excluded.destination_id,title=excluded.title,subtitle=excluded.subtitle,date=excluded.date,image=excluded.image,price=excluded.price,price_value=excluded.price_value,duration=excluded.duration,departure=excluded.departure,text=excluded.text,included=excluded.included,highlights=excluded.highlights,gallery=excluded.gallery,badge=excluded.badge,active=excluded.active;

insert into public.publications
(id,title,date,text,image,voyage_id,destination_id,active)
values
('omra-octobre-2026','Omra octobre 2026','20 août','Découvrez notre programme combiné au départ de Marseille vers Tunis et la Terre Sainte.','assets/umrah-combine.jpg','umrah-offer','omra',true),
('magie-du-caire','Découvrez la magie du Caire','18 mai','Entre pyramides, Nil, souks et patrimoine égyptien, Le Caire offre un dépaysement unique.','assets/cairo.jpg','cairo-offer','cairo',true),
('voyager-depuis-marseille','Voyager depuis Marseille','26 sept. 2023','New Age Travel France vous accompagne dans la préparation de vos départs depuis Marseille.','assets/companies.jpg',null,'tunisia',true)
on conflict (id) do update set
title=excluded.title,date=excluded.date,text=excluded.text,image=excluded.image,voyage_id=excluded.voyage_id,destination_id=excluded.destination_id,active=excluded.active;
