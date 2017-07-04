namespace :setup do
  task all: [:create_test_admin, :categories, :states_and_citites, :units, :create_default_users]

  task create_default_users: :environment do
    User.create!({ name: Faker::Name.name,
                   email: 'usertest@test.com',
                   address: Faker::Address.street_address,
                   phone: Faker::PhoneNumber.phone_number,
                   password: 'welcome123',
                   password_confirmation: 'welcome123',
                   city: City.first
                 })

    Seller.create!({ name: Faker::Name.name,
                   email: 'sellertest@test.com',
                   address: Faker::Address.street_address,
                   phone: Faker::PhoneNumber.phone_number,
                   password: 'welcome123',
                   password_confirmation: 'welcome123',
                   city: City.first
                 })
  end

  task create_test_admin: :environment do
    Admin.create!(
      name: 'Test Admin',
      email: 'admintest@test.com',
      password: 'welcome123',
      password_confirmation: 'welcome123'
    )
  end

  task categories: :environment do
    file = File.open("#{Rails.root}/public/test_image.png")
    Category.create!(name: 'Test 1', admin: Admin.first).assets.create!(image: file)
    Category.create!(name: 'Test 2', admin: Admin.first).assets.create!(image: file)
    Category.create!(name: 'Test 3', admin: Admin.first).assets.create!(image: file)
  end

  task states_and_citites: :environment do
    data = [
      { state_name: 'Ahuachapán', cities:['Ahuachapán','Jujutla','Atiquizaya','Concepción de Ataco','El Refugio','Guaymango','Apaneca','San Francisco Menéndez','San Lorenzo','San Pedro Puxtla','Tacuba','Turín']},
      { state_name: 'Santa Ana', cities:['Candelaria de la Frontera','Chalchuapa','Coatepeque','El Congo','El Porvenir','Masahuat','Metapán','San Antonio Pajonal','San Sebastián Salitrillo','Santa Ana','Santa Rosa Guachipilín','Santiago de la Frontera','Texistepeque']},
      { state_name: 'Sonsonate', cities:['Acajutla','Armenia','Caluco','Cuisnahuat','Izalco','Juayúa','Nahuizalco','Nahulingo','Salcoatitán','San Antonio del Monte','San Julián','Santa Catarina Masahuat','Santa Isabel Ishuatán','Santo Domingo','Sonsonate','Sonzacate']},
      { state_name: 'Chalatenango', cities:['Agua Caliente','Arcatao','Azacualpa','Chalatenango','Citalá','Comalapa','Concepción Quezaltepeque','Dulce Nombre de María','El Carrizal','El Paraíso','La Laguna','La Palma','La Reina','Las Vueltas','Nombre de Jesús','Nueva Concepción','Nueva Trinidad','Ojos de Agua','Potonico','San Antonio de la Cruz','San Antonio Los Ranchos','San Fernando','San Francisco Lempa','San Francisco Morazán','San Ignacio','San Isidro Labrador','San José Cancasque','San José Las Flores','San Luis del Carmen','San Miguel de Mercedes','San Rafael','Santa Rita','Tejutla'] },
      { state_name: 'La Libertad', cities:['Antiguo Cuscatlán','Chiltiupán','Ciudad Arce','Colón','Comasagua','Huizúcar','Jayaque','Jicalapa','La Libertad','Nueva San Salvador','Nuevo Cuscatlán','Opico','Quezaltepeque','Sacacoyo','San José Villanueva','San Matías','San Pablo Tacachico','Talnique','Tamanique','Teotepeque','Tepecoyo','Zaragoza'] },
      { state_name: 'San Salvador', cities:['Aguilares','Apopa','Ayutuxtepeque','Cuscatancingo','Ciudad Delgado','El Paisnal','Guazapa','Ilopango','Mejicanos','Nejapa','Panchimalco','Rosario de Mora','San Marcos','San Martín','San Salvador','Santiago Texacuangos','Santo Tomás','Soyapango','Tonacatepeque'] },
      { state_name: 'Cuscatlán', cities:['Candelaria','Cojutepeque','El Carmen','El Rosario','Monte San Juan','Oratorio de Concepción','San Bartolomé Perulapía','San Cristóbal','San José Guayabal','San Pedro Perulapán','San Rafael Cedros','San Ramón','Santa Cruz Analquito','Santa Cruz Michapa','Suchitoto','Tenancingo'] },
      { state_name: 'La Paz', cities:['Cuyultitán','El Rosario','Jerusalén','Mercedes La Ceiba','Olocuilta','Paraíso de Osorio','San Antonio Masahuat','San Emigdio','San Francisco Chinameca','San Juan Nonualco','San Juan Talpa','San Juan Tepezontes','San Luis La Herradura','San Luis Talpa','San Miguel Tepezontes','San Pedro Masahuat','San Pedro Nonualco','San Rafael Obrajuelo','Santa María Ostuma','Santiago Nonualco','Tapalhuaca','Zacatecoluca'] },
      { state_name: 'Cabañas', cities:['Cinquera','Villa Dolores','Guacotecti','Ilobasco','Jutiapa','San Isidro','Sensuntepeque','Ciudad de Tejutepeque','Victoria'] },
      { state_name: 'San Vicente', cities:['Apastepeque','Guadalupe','San Cayetano Istepeque','San Esteban Catarina','San Ildefonso','San Lorenzo','San Sebastián','Santa Clara','Santo Domingo','San Vicente','Tecoluca','Tepetitán','Verapaz'] },
      { state_name: 'Usulután', cities:['Alegría','Berlín','California','Concepción Batres','El Triunfo','Ereguayquín','Estanzuelas','Jiquilisco','Jucuapa','Jucuarán','Mercedes Umaña','Nueva Granada','Ozatlán','Puerto El Triunfo','San Agustín','San Buenaventura','San Dionisio','San Francisco Javier','Santa Elena','Santa María','Santiago de María','Tecapán','Usulután'] },
      { state_name: 'San Miguel', cities:['Carolina','Chapeltique','Chinameca','Chirilagua','Ciudad Barrios','Comacarán','El Tránsito','Lolotique','Moncagua','Nueva Guadalupe','Nuevo Edén de San Juan','Quelepa','San Antonio','San Gerardo','San Jorge','San Luis de la Reina','San Miguel','San Rafael','Sesori','Uluazapa'] },
      { state_name: 'Morazán', cities:['Arambala','Cacaopera','Chilanga','Corinto','Delicias de Concepción','El Divisadero','El Rosario','Gualococti','Guatajiagua','Joateca','Jocoaitique','Jocoro','Lolotiquillo','Meanguera','Osicala','Perquín','San Carlos','San Fernando','San Francisco Gotera','San Isidro','San Simón','Sensembra','Sociedad','Torola','Yamabal','Yoloaiquín'] },
      { state_name: 'La Unión', cities:['Anamorós','Bolívar','Concepción de Oriente','Conchagua','El Carmen','El Sauce','Intipucá','La Unión','Lislique','Meanguera del Golfo','Nueva Esparta','Pasaquina','Polorós','San Alejo','San José','Santa Rosa de Lima','Yayantique','Yucuayquín'] }
    ]

    state_instance = nil

    data.each do |state|
      state_instance = State.create!(name: state[:state_name])
      state[:cities].each do |city|
        state_instance.cities.create!(name: city)
      end
    end
  end

  task units: :environment do
    Unit.create!(
      [
        { name: 'Pounds', admin: Admin.last },
        { name: 'Ounces', admin: Admin.last },
        { name: 'Grams', admin: Admin.last },
        { name: 'Kilograms', admin: Admin.last }
      ]
    )
  end
end