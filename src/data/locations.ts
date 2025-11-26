export interface Dealer {
  id: string
  name: string
  address: string
  city: string
  province: string
  postcode: string
  phone: string
  email: string
  website?: string
  brands: string[]
  services: string[]
  openingHours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  coordinates: {
    lat: number
    lng: number
  }
  rating: number
  reviewCount: number
}

export interface City {
  name: string
  postcode: string
  province: string
  coordinates: {
    lat: number
    lng: number
  }
  dealers: Dealer[]
}

export interface Province {
  name: string
  code: string
  cities: City[]
}

export const provinces: Province[] = [
  {
    name: "Noord-Holland",
    code: "NH",
    cities: [
      {
        name: "Amsterdam",
        postcode: "1000-1109",
        province: "Noord-Holland",
        coordinates: { lat: 52.3676, lng: 4.9041 },
        dealers: [
          {
            id: "dealer-amsterdam-1",
            name: "Fietsenwinkel Amsterdam Centrum",
            address: "Kalverstraat 123",
            city: "Amsterdam",
            province: "Noord-Holland",
            postcode: "1012 NP",
            phone: "020-1234567",
            email: "amsterdam@fietsenwinkel.nl",
            website: "https://www.fietsenwinkel.nl",
            brands: ["Gazelle", "Batavus", "Sparta", "Van Moof", "Trek"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.3676, lng: 4.9041 },
            rating: 4.5,
            reviewCount: 127
          },
          {
            id: "dealer-amsterdam-2",
            name: "E-Bike Specialist Amsterdam",
            address: "Leidsestraat 45",
            city: "Amsterdam",
            province: "Noord-Holland",
            postcode: "1017 PA",
            phone: "020-9876543",
            email: "info@ebikespecialist.nl",
            website: "https://www.ebikespecialist.nl",
            brands: ["Cannondale", "Giant", "Specialized", "Canyon"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Custom builds"],
            openingHours: {
              monday: "10:00-19:00",
              tuesday: "10:00-19:00",
              wednesday: "10:00-19:00",
              thursday: "10:00-19:00",
              friday: "10:00-19:00",
              saturday: "10:00-18:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.3676, lng: 4.9041 },
            rating: 4.7,
            reviewCount: 89
          },
          {
            id: "dealer-amsterdam-3",
            name: "Fietsen bij Auke",
            address: "IJburglaan 1093",
            city: "Amsterdam",
            province: "Noord-Holland",
            postcode: "1087 EN",
            phone: "020-1234567",
            email: "info@fietsenbijauke.nl",
            brands: ["Gazelle", "Batavus", "Sparta", "Riese & Müller"],
            services: ["Verkoop", "Onderhoud", "Testritten"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.3676, lng: 4.9041 },
            rating: 4.3,
            reviewCount: 76
          },
          {
            id: "dealer-amsterdam-4",
            name: "Het Zwarte Fietsenplan Oostpoort",
            address: "Land van Cocagneplein 1E",
            city: "Amsterdam",
            province: "Noord-Holland",
            postcode: "1093 NB",
            phone: "020-1234567",
            email: "oostpoort@hetzwartefietsenplan.nl",
            website: "https://www.hetzwartefietsenplan.com",
            brands: ["Van Moof", "Gazelle", "Batavus", "Sparta", "Trek"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.3676, lng: 4.9041 },
            rating: 4.6,
            reviewCount: 134
          },
          {
            id: "dealer-amsterdam-5",
            name: "De Snelbinder",
            address: "Molukkenstraat 13",
            city: "Amsterdam",
            province: "Noord-Holland",
            postcode: "1095 AR",
            phone: "020-1234567",
            email: "info@desnelbinder.nl",
            brands: ["Trek", "Giant", "Cannondale", "Orbea"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.3676, lng: 4.9041 },
            rating: 4.4,
            reviewCount: 92
          }
        ]
      },
      {
        name: "Haarlem",
        postcode: "2000-2037",
        province: "Noord-Holland",
        coordinates: { lat: 52.3792, lng: 4.6377 },
        dealers: [
          {
            id: "dealer-haarlem-1",
            name: "Fietsenwinkel Haarlem",
            address: "Grote Houtstraat 78",
            city: "Haarlem",
            province: "Noord-Holland",
            postcode: "2011 SZ",
            phone: "023-1234567",
            email: "haarlem@fietsenwinkel.nl",
            brands: ["Gazelle", "Batavus", "Sparta", "Riese & Müller"],
            services: ["Verkoop", "Onderhoud", "Testritten"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.3792, lng: 4.6377 },
            rating: 4.3,
            reviewCount: 95
          }
        ]
      },
      {
        name: "Alkmaar",
        postcode: "1800-1831",
        province: "Noord-Holland",
        coordinates: { lat: 52.6316, lng: 4.7485 },
        dealers: [
          {
            id: "dealer-alkmaar-1",
            name: "E-Bike Alkmaar",
            address: "Laat 12",
            city: "Alkmaar",
            province: "Noord-Holland",
            postcode: "1811 BR",
            phone: "072-1234567",
            email: "info@ebikealkmaar.nl",
            brands: ["Trek", "Giant", "Cannondale", "Orbea"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.6316, lng: 4.7485 },
            rating: 4.4,
            reviewCount: 67
          }
        ]
      },
      {
        name: "Amstelveen",
        postcode: "1180-1189",
        province: "Noord-Holland",
        coordinates: { lat: 52.3032, lng: 4.8631 },
        dealers: [
          {
            id: "dealer-amstelveen-1",
            name: "Maus Fietsen",
            address: "Amsterdamseweg 410",
            city: "Amstelveen",
            province: "Noord-Holland",
            postcode: "1181 BT",
            phone: "020-1234567",
            email: "info@mausfietsen.nl",
            brands: ["Gazelle", "Batavus", "Sparta", "Van Moof"],
            services: ["Verkoop", "Onderhoud", "Testritten"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.3032, lng: 4.8631 },
            rating: 4.5,
            reviewCount: 98
          },
          {
            id: "dealer-amstelveen-2",
            name: "Het Fietshuys Amstelveen",
            address: "Sandbergplein 24B",
            city: "Amstelveen",
            province: "Noord-Holland",
            postcode: "1181 ZX",
            phone: "020-1234567",
            email: "amstelveen@hetfietshuys.nl",
            brands: ["Trek", "Giant", "Cannondale", "Specialized"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.3032, lng: 4.8631 },
            rating: 4.3,
            reviewCount: 76
          },
          {
            id: "dealer-amstelveen-3",
            name: "Van Rietschoten Tweewielers",
            address: "Keizer Karelplein 12",
            city: "Amstelveen",
            province: "Noord-Holland",
            postcode: "1185 HL",
            phone: "020-1234567",
            email: "info@vanrietschoten.nl",
            brands: ["Gazelle", "Batavus", "Sparta", "Riese & Müller"],
            services: ["Verkoop", "Onderhoud", "Testritten"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.3032, lng: 4.8631 },
            rating: 4.6,
            reviewCount: 124
          }
        ]
      }
    ]
  },
  {
    name: "Zuid-Holland",
    code: "ZH",
    cities: [
      {
        name: "Rotterdam",
        postcode: "3000-3089",
        province: "Zuid-Holland",
        coordinates: { lat: 51.9244, lng: 4.4777 },
        dealers: [
          {
            id: "dealer-rotterdam-1",
            name: "Fietsenwinkel Rotterdam Centrum",
            address: "Lijnbaan 45",
            city: "Rotterdam",
            province: "Zuid-Holland",
            postcode: "3012 EN",
            phone: "010-1234567",
            email: "rotterdam@fietsenwinkel.nl",
            brands: ["Gazelle", "Batavus", "Sparta", "Van Moof"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 51.9244, lng: 4.4777 },
            rating: 4.6,
            reviewCount: 156
          },
          {
            id: "dealer-rotterdam-2",
            name: "E-Bike Rotterdam Zuid",
            address: "Zuidplein 123",
            city: "Rotterdam",
            province: "Zuid-Holland",
            postcode: "3083 CB",
            phone: "010-9876543",
            email: "zuid@ebikerotterdam.nl",
            brands: ["Trek", "Giant", "Specialized", "Canyon"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Custom builds"],
            openingHours: {
              monday: "10:00-19:00",
              tuesday: "10:00-19:00",
              wednesday: "10:00-19:00",
              thursday: "10:00-19:00",
              friday: "10:00-19:00",
              saturday: "10:00-18:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 51.9244, lng: 4.4777 },
            rating: 4.4,
            reviewCount: 78
          },
          {
            id: "dealer-rotterdam-3",
            name: "Noord | e-bike to go",
            address: "Hoogstraat 43a",
            city: "Rotterdam",
            province: "Zuid-Holland",
            postcode: "3011 PE",
            phone: "010-1234567",
            email: "noord@ebiketogo.nl",
            brands: ["Van Moof", "Gazelle", "Batavus", "Sparta"],
            services: ["Verkoop", "Onderhoud", "Testritten"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 51.9244, lng: 4.4777 },
            rating: 4.5,
            reviewCount: 103
          }
        ]
      },
      {
        name: "Den Haag",
        postcode: "2500-2599",
        province: "Zuid-Holland",
        coordinates: { lat: 52.0705, lng: 4.3007 },
        dealers: [
          {
            id: "dealer-denhaag-1",
            name: "Fietsenwinkel Den Haag",
            address: "Spui 67",
            city: "Den Haag",
            province: "Zuid-Holland",
            postcode: "2511 BT",
            phone: "070-1234567",
            email: "denhaag@fietsenwinkel.nl",
            brands: ["Gazelle", "Batavus", "Sparta", "Riese & Müller"],
            services: ["Verkoop", "Onderhoud", "Testritten"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.0705, lng: 4.3007 },
            rating: 4.5,
            reviewCount: 112
          }
        ]
      },
      {
        name: "Leiden",
        postcode: "2300-2334",
        province: "Zuid-Holland",
        coordinates: { lat: 52.1601, lng: 4.4970 },
        dealers: [
          {
            id: "dealer-leiden-1",
            name: "E-Bike Leiden",
            address: "Breestraat 89",
            city: "Leiden",
            province: "Zuid-Holland",
            postcode: "2311 CL",
            phone: "071-1234567",
            email: "info@ebikeleiden.nl",
            brands: ["Trek", "Giant", "Cannondale", "Orbea"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.1601, lng: 4.4970 },
            rating: 4.2,
            reviewCount: 54
          }
        ]
      }
    ]
  },
  {
    name: "Utrecht",
    code: "UT",
    cities: [
      {
        name: "Utrecht",
        postcode: "3500-3585",
        province: "Utrecht",
        coordinates: { lat: 52.0907, lng: 5.1214 },
        dealers: [
          {
            id: "dealer-utrecht-1",
            name: "Fietsenwinkel Utrecht Centrum",
            address: "Oudegracht 123",
            city: "Utrecht",
            province: "Utrecht",
            postcode: "3511 AL",
            phone: "030-1234567",
            email: "utrecht@fietsenwinkel.nl",
            brands: ["Gazelle", "Batavus", "Sparta", "Van Moof"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.0907, lng: 5.1214 },
            rating: 4.7,
            reviewCount: 189
          },
          {
            id: "dealer-utrecht-2",
            name: "E-Bike Specialist Utrecht",
            address: "Vredenburg 45",
            city: "Utrecht",
            province: "Utrecht",
            postcode: "3511 BB",
            phone: "030-9876543",
            email: "info@ebikespecialist-utrecht.nl",
            brands: ["Trek", "Giant", "Specialized", "Canyon", "Orbea"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Custom builds"],
            openingHours: {
              monday: "10:00-19:00",
              tuesday: "10:00-19:00",
              wednesday: "10:00-19:00",
              thursday: "10:00-19:00",
              friday: "10:00-19:00",
              saturday: "10:00-18:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.0907, lng: 5.1214 },
            rating: 4.8,
            reviewCount: 134
          },
          {
            id: "dealer-utrecht-3",
            name: "FREEM fietsen",
            address: "Oudegracht 200",
            city: "Utrecht",
            province: "Utrecht",
            postcode: "3511 NR",
            phone: "030-1234567",
            email: "info@freemfietsen.nl",
            brands: ["Van Moof", "Gazelle", "Batavus", "Sparta"],
            services: ["Verkoop", "Onderhoud", "Testritten"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.0907, lng: 5.1214 },
            rating: 4.6,
            reviewCount: 87
          }
        ]
      },
      {
        name: "Amersfoort",
        postcode: "3800-3839",
        province: "Utrecht",
        coordinates: { lat: 52.1561, lng: 5.3878 },
        dealers: [
          {
            id: "dealer-amersfoort-1",
            name: "E-Bike Amersfoort",
            address: "Langegracht 78",
            city: "Amersfoort",
            province: "Utrecht",
            postcode: "3811 JZ",
            phone: "033-1234567",
            email: "info@ebikeamersfoort.nl",
            brands: ["Trek", "Giant", "Cannondale", "Orbea"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.1561, lng: 5.3878 },
            rating: 4.3,
            reviewCount: 76
          },
          {
            id: "dealer-amersfoort-2",
            name: "Trek Bicycle Amersfoort",
            address: "Eemplein 100",
            city: "Amersfoort",
            province: "Utrecht",
            postcode: "3812 EA",
            phone: "033-1234567",
            email: "amersfoort@trekbicycle.nl",
            website: "https://www.trekbicycle.com",
            brands: ["Trek", "Giant", "Cannondale", "Specialized"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.1561, lng: 5.3878 },
            rating: 4.7,
            reviewCount: 112
          },
          {
            id: "dealer-amersfoort-3",
            name: "Fietsvoordeelshop Amersfoort",
            address: "Amsterdamseweg 49B",
            city: "Amersfoort",
            province: "Utrecht",
            postcode: "3812 RP",
            phone: "033-1234567",
            email: "amersfoort@fietsvoordeelshop.nl",
            brands: ["Gazelle", "Batavus", "Sparta", "Van Moof"],
            services: ["Verkoop", "Onderhoud", "Testritten"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.1561, lng: 5.3878 },
            rating: 4.4,
            reviewCount: 89
          }
        ]
      }
    ]
  },
  {
    name: "Gelderland",
    code: "GE",
    cities: [
      {
        name: "Arnhem",
        postcode: "6800-6846",
        province: "Gelderland",
        coordinates: { lat: 51.9851, lng: 5.8987 },
        dealers: [
          {
            id: "dealer-arnhem-1",
            name: "Fietsenwinkel Arnhem",
            address: "Kerkstraat 45",
            city: "Arnhem",
            province: "Gelderland",
            postcode: "6811 GW",
            phone: "026-1234567",
            email: "arnhem@fietsenwinkel.nl",
            brands: ["Gazelle", "Batavus", "Sparta", "Riese & Müller"],
            services: ["Verkoop", "Onderhoud", "Testritten"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 51.9851, lng: 5.8987 },
            rating: 4.4,
            reviewCount: 98
          }
        ]
      },
      {
        name: "Nijmegen",
        postcode: "6500-6547",
        province: "Gelderland",
        coordinates: { lat: 51.8426, lng: 5.8531 },
        dealers: [
          {
            id: "dealer-nijmegen-1",
            name: "E-Bike Nijmegen",
            address: "Grote Markt 12",
            city: "Nijmegen",
            province: "Gelderland",
            postcode: "6511 KB",
            phone: "024-1234567",
            email: "info@ebikenijmegen.nl",
            brands: ["Trek", "Giant", "Cannondale", "Orbea"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 51.8426, lng: 5.8531 },
            rating: 4.5,
            reviewCount: 87
          }
        ]
      },
      {
        name: "Twello",
        postcode: "7390-7399",
        province: "Gelderland",
        coordinates: { lat: 52.2367, lng: 6.1028 },
        dealers: [
          {
            id: "dealer-twello-1",
            name: "De Vouwfiets Specialist",
            address: "Koppelstraat 2",
            city: "Twello",
            province: "Gelderland",
            postcode: "7391 AK",
            phone: "0571-123456",
            email: "info@devouwfiets.nl",
            website: "https://www.devouwfiets.nl",
            brands: ["Brompton", "Tern", "Dahon", "Van Moof"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.2367, lng: 6.1028 },
            rating: 4.7,
            reviewCount: 134
          }
        ]
      }
    ]
  },
  {
    name: "Overijssel",
    code: "OV",
    cities: [
      {
        name: "Enschede",
        postcode: "7500-7549",
        province: "Overijssel",
        coordinates: { lat: 52.2215, lng: 6.8937 },
        dealers: [
          {
            id: "dealer-enschede-1",
            name: "E-Bike Enschede",
            address: "Van Heekplein 34",
            city: "Enschede",
            province: "Overijssel",
            postcode: "7511 EH",
            phone: "053-1234567",
            email: "info@ebikeenschede.nl",
            brands: ["Trek", "Giant", "Cannondale", "Orbea"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.2215, lng: 6.8937 },
            rating: 4.2,
            reviewCount: 65
          }
        ]
      },
      {
        name: "Zwolle",
        postcode: "8000-8049",
        province: "Overijssel",
        coordinates: { lat: 52.5168, lng: 6.0830 },
        dealers: [
          {
            id: "dealer-zwolle-1",
            name: "Fietsenwinkel Zwolle",
            address: "Grote Markt 23",
            city: "Zwolle",
            province: "Overijssel",
            postcode: "8011 LW",
            phone: "038-1234567",
            email: "zwolle@fietsenwinkel.nl",
            brands: ["Gazelle", "Batavus", "Sparta", "Riese & Müller"],
            services: ["Verkoop", "Onderhoud", "Testritten"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.5168, lng: 6.0830 },
            rating: 4.6,
            reviewCount: 112
          }
        ]
      },
      {
        name: "Raalte",
        postcode: "8100-8109",
        province: "Overijssel",
        coordinates: { lat: 52.3854, lng: 6.2751 },
        dealers: [
          {
            id: "dealer-raalte-1",
            name: "123 E-BIKES B.V.",
            address: "Spitsstraat 13A",
            city: "Raalte",
            province: "Overijssel",
            postcode: "8102 HW",
            phone: "0572-123456",
            email: "info@123ebikes.nl",
            website: "https://www.123ebikes.nl",
            brands: ["Trek", "Giant", "Cannondale", "Specialized", "Orbea"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.3854, lng: 6.2751 },
            rating: 4.8,
            reviewCount: 156
          }
        ]
      },
      {
        name: "Groningen Stad",
        postcode: "9700-9749",
        province: "Groningen",
        coordinates: { lat: 53.2194, lng: 6.5665 },
        dealers: [
          {
            id: "dealer-groningen-2",
            name: "Pims Fietsen",
            address: "Herestraat 23",
            city: "Groningen",
            province: "Groningen",
            postcode: "9711 ER",
            phone: "050-1234567",
            email: "info@pimsfietsen.nl",
            website: "https://www.pimsfietsen.nl",
            brands: ["Gazelle", "Batavus", "Sparta", "Van Moof"],
            services: ["Verkoop", "Onderhoud", "Testritten"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 53.2194, lng: 6.5665 },
            rating: 4.5,
            reviewCount: 89
          }
        ]
      }
    ]
  },
  {
    name: "Friesland",
    code: "FR",
    cities: [
      {
        name: "Leeuwarden",
        postcode: "8900-8949",
        province: "Friesland",
        coordinates: { lat: 53.2012, lng: 5.7999 },
        dealers: [
          {
            id: "dealer-leeuwarden-1",
            name: "E-Bike Leeuwarden",
            address: "Nieuwestad 45",
            city: "Leeuwarden",
            province: "Friesland",
            postcode: "8911 DH",
            phone: "058-1234567",
            email: "info@ebikeleeuwarden.nl",
            brands: ["Trek", "Giant", "Cannondale", "Orbea"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 53.2012, lng: 5.7999 },
            rating: 4.3,
            reviewCount: 78
          }
        ]
      },
      {
        name: "Emmen",
        postcode: "7800-7839",
        province: "Drenthe",
        coordinates: { lat: 52.7792, lng: 6.9072 },
        dealers: [
          {
            id: "dealer-emmen-1",
            name: "Bike Totaal Theo Bruning",
            address: "Hoofdstraat 45",
            city: "Emmen",
            province: "Drenthe",
            postcode: "7811 AP",
            phone: "0591-123456",
            email: "info@biketotaaltheo.nl",
            website: "https://www.biketotaaltheo.nl",
            brands: ["Gazelle", "Batavus", "Sparta", "Trek"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.7792, lng: 6.9072 },
            rating: 4.3,
            reviewCount: 67
          }
        ]
      }
    ]
  },
  {
    name: "Groningen",
    code: "GR",
    cities: [
      {
        name: "Groningen",
        postcode: "9700-9749",
        province: "Groningen",
        coordinates: { lat: 53.2194, lng: 6.5665 },
        dealers: [
          {
            id: "dealer-groningen-1",
            name: "Fietsenwinkel Groningen",
            address: "Grote Markt 67",
            city: "Groningen",
            province: "Groningen",
            postcode: "9712 HS",
            phone: "050-1234567",
            email: "groningen@fietsenwinkel.nl",
            brands: ["Gazelle", "Batavus", "Sparta", "Riese & Müller"],
            services: ["Verkoop", "Onderhoud", "Testritten"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 53.2194, lng: 6.5665 },
            rating: 4.5,
            reviewCount: 94
          }
        ]
      },
      {
        name: "Goes",
        postcode: "4460-4479",
        province: "Zeeland",
        coordinates: { lat: 51.5045, lng: 3.8887 },
        dealers: [
          {
            id: "dealer-goes-1",
            name: "Bike Totaal Mirjam",
            address: "Korte Kerkstraat 15",
            city: "Goes",
            province: "Zeeland",
            postcode: "4461 HT",
            phone: "0113-123456",
            email: "info@biketotaalmirjam.nl",
            website: "https://www.biketotaalmirjam.nl",
            brands: ["Gazelle", "Batavus", "Sparta", "Van Moof"],
            services: ["Verkoop", "Onderhoud", "Testritten"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 51.5045, lng: 3.8887 },
            rating: 4.4,
            reviewCount: 76
          }
        ]
      }
    ]
  },
  {
    name: "Drenthe",
    code: "DR",
    cities: [
      {
        name: "Assen",
        postcode: "9400-9449",
        province: "Drenthe",
        coordinates: { lat: 52.9967, lng: 6.5621 },
        dealers: [
          {
            id: "dealer-assen-1",
            name: "E-Bike Assen",
            address: "Marktstraat 23",
            city: "Assen",
            province: "Drenthe",
            postcode: "9401 JH",
            phone: "0592-123456",
            email: "info@ebikeassen.nl",
            brands: ["Trek", "Giant", "Cannondale", "Orbea"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.9967, lng: 6.5621 },
            rating: 4.1,
            reviewCount: 56
          }
        ]
      }
    ]
  },
  {
    name: "Limburg",
    code: "LI",
    cities: [
      {
        name: "Maastricht",
        postcode: "6200-6239",
        province: "Limburg",
        coordinates: { lat: 50.8514, lng: 5.6910 },
        dealers: [
          {
            id: "dealer-maastricht-1",
            name: "E-Bike Maastricht",
            address: "Vrijthof 12",
            city: "Maastricht",
            province: "Limburg",
            postcode: "6211 LE",
            phone: "043-1234567",
            email: "info@ebikemaastricht.nl",
            brands: ["Trek", "Giant", "Cannondale", "Orbea"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 50.8514, lng: 5.6910 },
            rating: 4.4,
            reviewCount: 73
          }
        ]
      },
      {
        name: "Almere Stad",
        postcode: "1300-1379",
        province: "Flevoland",
        coordinates: { lat: 52.3508, lng: 5.2647 },
        dealers: [
          {
            id: "dealer-almere-2",
            name: "Bike Totaal Schulting",
            address: "Stadhuisplein 12",
            city: "Almere",
            province: "Flevoland",
            postcode: "1315 XA",
            phone: "036-1234567",
            email: "info@biketotaalschulting.nl",
            website: "https://www.biketotaalschulting.nl",
            brands: ["Gazelle", "Batavus", "Sparta", "Trek"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.3508, lng: 5.2647 },
            rating: 4.5,
            reviewCount: 92
          }
        ]
      }
    ]
  },
  {
    name: "Noord-Brabant",
    code: "NB",
    cities: [
      {
        name: "Eindhoven",
        postcode: "5600-5658",
        province: "Noord-Brabant",
        coordinates: { lat: 51.4416, lng: 5.4697 },
        dealers: [
          {
            id: "dealer-eindhoven-1",
            name: "Fietsenwinkel Eindhoven",
            address: "Stratumseind 89",
            city: "Eindhoven",
            province: "Noord-Brabant",
            postcode: "5611 EA",
            phone: "040-1234567",
            email: "eindhoven@fietsenwinkel.nl",
            brands: ["Gazelle", "Batavus", "Sparta", "Riese & Müller"],
            services: ["Verkoop", "Onderhoud", "Testritten"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 51.4416, lng: 5.4697 },
            rating: 4.6,
            reviewCount: 145
          }
        ]
      },
      {
        name: "Tilburg",
        postcode: "5000-5049",
        province: "Noord-Brabant",
        coordinates: { lat: 51.5555, lng: 5.0913 },
        dealers: [
          {
            id: "dealer-tilburg-1",
            name: "E-Bike Tilburg",
            address: "Heuvel 34",
            city: "Tilburg",
            province: "Noord-Brabant",
            postcode: "5038 ED",
            phone: "013-1234567",
            email: "info@ebiketilburg.nl",
            brands: ["Trek", "Giant", "Cannondale", "Orbea"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 51.5555, lng: 5.0913 },
            rating: 4.3,
            reviewCount: 89
          }
        ]
      },
      {
        name: "Haelen",
        postcode: "6080-6089",
        province: "Limburg",
        coordinates: { lat: 51.2347, lng: 5.9567 },
        dealers: [
          {
            id: "dealer-haelen-1",
            name: "Bike Service Leudal",
            address: "Roggelseweg 6",
            city: "Haelen",
            province: "Limburg",
            postcode: "6081 CT",
            phone: "0475-123456",
            email: "info@bikeserviceleudal.nl",
            website: "https://www.bikeserviceleudal.nl",
            brands: ["Trek", "Giant", "Cannondale", "Specialized"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 51.2347, lng: 5.9567 },
            rating: 4.6,
            reviewCount: 98
          }
        ]
      }
    ]
  },
  {
    name: "Zeeland",
    code: "ZE",
    cities: [
      {
        name: "Middelburg",
        postcode: "4330-4349",
        province: "Zeeland",
        coordinates: { lat: 51.4990, lng: 3.6100 },
        dealers: [
          {
            id: "dealer-middelburg-1",
            name: "E-Bike Middelburg",
            address: "Markt 56",
            city: "Middelburg",
            province: "Zeeland",
            postcode: "4331 LG",
            phone: "0118-123456",
            email: "info@ebikemiddelburg.nl",
            brands: ["Trek", "Giant", "Cannondale", "Orbea"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 51.4990, lng: 3.6100 },
            rating: 4.2,
            reviewCount: 61
          }
        ]
      },
      {
        name: "Leeuwarden Stad",
        postcode: "8900-8949",
        province: "Friesland",
        coordinates: { lat: 53.2012, lng: 5.7999 },
        dealers: [
          {
            id: "dealer-leeuwarden-2",
            name: "Fietsenwinkel Leeuwarden",
            address: "Nieuwestad 45",
            city: "Leeuwarden",
            province: "Friesland",
            postcode: "8911 DD",
            phone: "058-1234567",
            email: "info@fietsenwinkelleeuwarden.nl",
            website: "https://www.fietsenwinkelleeuwarden.nl",
            brands: ["Gazelle", "Batavus", "Sparta", "Riese & Müller"],
            services: ["Verkoop", "Onderhoud", "Testritten"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 53.2012, lng: 5.7999 },
            rating: 4.4,
            reviewCount: 78
          }
        ]
      }
    ]
  },
  {
    name: "Flevoland",
    code: "FL",
    cities: [
      {
        name: "Almere",
        postcode: "1300-1379",
        province: "Flevoland",
        coordinates: { lat: 52.3508, lng: 5.2647 },
        dealers: [
          {
            id: "dealer-almere-1",
            name: "E-Bike Almere",
            address: "Stadhuisplein 12",
            city: "Almere",
            province: "Flevoland",
            postcode: "1315 XE",
            phone: "036-1234567",
            email: "info@ebikealmere.nl",
            brands: ["Trek", "Giant", "Cannondale", "Orbea"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 52.3508, lng: 5.2647 },
            rating: 4.4,
            reviewCount: 82
          }
        ]
      },
      {
        name: "Eindhoven Stad",
        postcode: "5600-5658",
        province: "Noord-Brabant",
        coordinates: { lat: 51.4416, lng: 5.4697 },
        dealers: [
          {
            id: "dealer-eindhoven-2",
            name: "Rijwielhuis 't Verzet",
            address: "Stratumseind 23",
            city: "Eindhoven",
            province: "Noord-Brabant",
            postcode: "5611 EA",
            phone: "040-1234567",
            email: "info@rijwielhuistverzet.nl",
            website: "https://www.rijwielhuistverzet.nl",
            brands: ["Trek", "Giant", "Cannondale", "Specialized"],
            services: ["Verkoop", "Onderhoud", "Testritten", "Reparaties"],
            openingHours: {
              monday: "09:00-18:00",
              tuesday: "09:00-18:00",
              wednesday: "09:00-18:00",
              thursday: "09:00-18:00",
              friday: "09:00-18:00",
              saturday: "09:00-17:00",
              sunday: "Gesloten"
            },
            coordinates: { lat: 51.4416, lng: 5.4697 },
            rating: 4.6,
            reviewCount: 108
          }
        ]
      }
    ]
  }
]

// Helper functions
export function getAllDealers(): Dealer[] {
  return provinces.flatMap(province => 
    province.cities.flatMap(city => city.dealers)
  )
}

export function getDealersByCity(cityName: string): Dealer[] {
  const city = provinces
    .flatMap(province => province.cities)
    .find(city => city.name.toLowerCase() === cityName.toLowerCase())
  
  return city ? city.dealers : []
}

export function getDealersByProvince(provinceName: string): Dealer[] {
  const province = provinces.find(p => 
    p.name.toLowerCase() === provinceName.toLowerCase()
  )
  
  return province ? 
    province.cities.flatMap(city => city.dealers) : []
}

export function getCitiesByProvince(provinceName: string): City[] {
  const province = provinces.find(p => 
    p.name.toLowerCase() === provinceName.toLowerCase()
  )
  
  return province ? province.cities : []
}

export function findNearestDealers(
  userLat: number, 
  userLng: number, 
  maxDistance: number = 50
): Dealer[] {
  const allDealers = getAllDealers()
  
  return allDealers
    .map(dealer => ({
      ...dealer,
      distance: calculateDistance(
        userLat, 
        userLng, 
        dealer.coordinates.lat, 
        dealer.coordinates.lng
      )
    }))
    .filter(dealer => dealer.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
}

export function calculateDistance(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export function searchDealers(query: string): Dealer[] {
  const allDealers = getAllDealers()
  const searchTerm = query.toLowerCase()
  
  return allDealers.filter(dealer => 
    dealer.name.toLowerCase().includes(searchTerm) ||
    dealer.city.toLowerCase().includes(searchTerm) ||
    dealer.province.toLowerCase().includes(searchTerm) ||
    dealer.brands.some(brand => brand.toLowerCase().includes(searchTerm))
  )
}
