/* Scenes of the walk-through: real photographs of CBA Suites Madeira, each turned into a 3D depth scene.
   Hotspots: x, y as fractions of the photo (0,0 = top left). */
window.TOUR_SCENES = [
  { id: 'lobby', img: 'h-lobby-1600', ch: 'lobby', hs: [{ to: 'billiards', x: .8, y: .5 }, { to: 'living-city', x: .48, y: .36 }] },
  { id: 'billiards', img: 'h-lobby-billiards-1600', ch: 'lobby', hs: [{ to: 'lobby', x: .12, y: .55 }, { to: 'living-city', x: .62, y: .3 }] },
  { id: 'living-city', img: 'h-living-city-1600', ch: 'suite', hs: [{ to: 'kitchen', x: .27, y: .44 }, { to: 'bed-queen', x: .4, y: .4 }, { to: 'suite-sea', x: .07, y: .6 }] },
  { id: 'kitchen', img: 'h-kitchen-fruit-1600', ch: 'suite', hs: [{ to: 'suite-sea', x: .88, y: .5 }] },
  { id: 'suite-sea', img: 'h-suite-sea-1600', ch: 'suite', hs: [{ to: 'balcony', x: .6, y: .42 }, { to: 'suite-bay', x: .28, y: .62 }, { to: 'kitchen', x: .08, y: .3 }] },
  { id: 'suite-bay', img: 'h-suite-bay-1600', ch: 'suite', hs: [{ to: 'balcony', x: .33, y: .55 }, { to: 'view', x: .73, y: .38 }, { to: 'living-city', x: .9, y: .62 }] },
  { id: 'balcony', img: 'h-balcony-terrace-800', ch: 'suite', hs: [{ to: 'suite-bay', x: .62, y: .5 }, { to: 'view', x: .12, y: .22 }] },
  { id: 'view', img: 'h-view-balcony-1600', ch: 'suite', hs: [{ to: 'suite-bay', x: .05, y: .55 }, { to: 'bed-queen', x: .92, y: .85 }] },
  { id: 'bed-queen', img: 'h-bed-queen-1600', ch: 'suite', hs: [{ to: 'living-city', x: .08, y: .45 }, { to: 'bed-warm', x: .85, y: .4 }] },
  { id: 'bed-warm', img: 'h-bed-warm-800', ch: 'studio', hs: [{ to: 'studio', x: .2, y: .55 }, { to: 'view', x: .78, y: .32 }] },
  { id: 'studio', img: 'h-studio-1600', ch: 'studio', hs: [{ to: 'bed-warm', x: .12, y: .6 }, { to: 'duplex', x: .82, y: .45 }] },
  { id: 'duplex', img: 'h-suite-duplex-1600', ch: 'duplex', hs: [{ to: 'duplex-living', x: .3, y: .45 }, { to: 'skylight', x: .72, y: .28 }] },
  { id: 'duplex-living', img: 'h-living-balcony-1600', ch: 'duplex', hs: [{ to: 'skylight', x: .9, y: .5 }, { to: 'duplex', x: .1, y: .62 }] },
  { id: 'skylight', img: 'h-skylight-1600', ch: 'duplex', hs: [{ to: 'pool-above', x: .5, y: .38 }] },
  { id: 'pool-above', img: 'h-pool-above-1600', ch: 'pool', hs: [{ to: 'pool-palms', x: .45, y: .5 }] },
  { id: 'pool-palms', img: 'h-pool-palms-1600', ch: 'pool', hs: [{ to: 'panorama', x: .5, y: .2 }] },
  { id: 'panorama', img: 'h-panorama-1600', ch: 'pool', hs: [{ to: 'lobby', x: .5, y: .75 }] }
];

window.TOUR_I18N = {
  en: {
    book: 'Book a suite', back: 'Main site', kicker: 'Walk through CBA Suites Madeira', loading: 'Opening the doors…',
    auto: 'Walk me through', stop: 'Pause', next: 'Next', prev: 'Back',
    hint: 'Move the mouse to look around · click a point to walk there',
    hintTouch: 'Tilt or drag to look around · tap a point to walk there',
    ch: { lobby: 'Lobby', suite: 'Sea-view suite', studio: 'Studio', duplex: 'Duplex', pool: 'Rooftop pool' },
    s: {
      lobby: ['Lobby lounge', 'Velvet armchairs, chandeliers and a welcome glass of Madeira wine at the desk.'],
      billiards: ['Games room', 'A billiards table and a vintage bike, just off the lobby.'],
      'living-city': ['Living and dining', 'Table for four, wall TV and a kitchenette, with the bedroom down the hall.'],
      kitchen: ['Kitchenette', 'Hob, microwave, kettle and fridge: breakfast at home whenever you like.'],
      'suite-sea': ['Living room', 'Sofa bed, dining table and sliding doors onto the terrace.'],
      'suite-bay': ['Towards the terrace', 'Floor-to-ceiling glass and the hills of Funchal in the window.'],
      balcony: ['Private terrace', 'Slate floor, planters and a table for two in the sun.'],
      view: ['The view', 'The whole amphitheatre of Funchal down to the Atlantic.'],
      'bed-queen': ['Bedroom', 'Queen bed, reading lights and an open wardrobe.'],
      'bed-warm': ['Bedroom with windows', 'Two windows over the city and blackout curtains.'],
      studio: ['Studio suite', 'Bed, sofa and wardrobe in one bright room.'],
      duplex: ['Duplex suite', 'Living room downstairs, stairs up to the attic bedroom.'],
      'duplex-living': ['Duplex living room', 'Glass doors onto the balcony and a TV on the wall.'],
      skylight: ['Attic skylight', 'Funchal bay framed above the bed.'],
      'pool-above': ['Rooftop pool', 'Sun loungers on the stone deck, open all day.'],
      'pool-palms': ['Pool garden', 'Volcanic stone walls and palms around the water.'],
      panorama: ['Above Funchal', 'Five minutes above downtown, the whole city at your feet.']
    }
  },
  pt: {
    book: 'Reservar suite', back: 'Site principal', kicker: 'Passeio pelo CBA Suites Madeira', loading: 'A abrir as portas…',
    auto: 'Passeio guiado', stop: 'Pausa', next: 'Seguinte', prev: 'Voltar',
    hint: 'Mova o rato para olhar · clique num ponto para ir até lá',
    hintTouch: 'Incline ou arraste para olhar · toque num ponto para ir até lá',
    ch: { lobby: 'Receção', suite: 'Suite vista mar', studio: 'Estúdio', duplex: 'Duplex', pool: 'Piscina' },
    s: {
      lobby: ['Lounge da receção', 'Poltronas de veludo, candeeiros e um cálice de vinho Madeira à chegada.'],
      billiards: ['Sala de jogos', 'Mesa de bilhar e uma bicicleta antiga, ao lado da receção.'],
      'living-city': ['Sala e jantar', 'Mesa para quatro, TV e kitchenette, com o quarto ao fundo do corredor.'],
      kitchen: ['Kitchenette', 'Placa, micro-ondas, chaleira e frigorífico.'],
      'suite-sea': ['Sala', 'Sofá-cama, mesa de jantar e portas de correr para o terraço.'],
      'suite-bay': ['Para o terraço', 'Vidro do chão ao teto e as colinas do Funchal na janela.'],
      balcony: ['Terraço privado', 'Chão de ardósia, floreiras e mesa para dois ao sol.'],
      view: ['A vista', 'Todo o anfiteatro do Funchal até ao Atlântico.'],
      'bed-queen': ['Quarto', 'Cama queen, luzes de leitura e roupeiro aberto.'],
      'bed-warm': ['Quarto com janelas', 'Duas janelas sobre a cidade e cortinas blackout.'],
      studio: ['Suite estúdio', 'Cama, sofá e roupeiro numa sala luminosa.'],
      duplex: ['Suite duplex', 'Sala em baixo, escada para o quarto no sótão.'],
      'duplex-living': ['Sala do duplex', 'Portas de vidro para a varanda e TV.'],
      skylight: ['Claraboia do sótão', 'A baía do Funchal emoldurada sobre a cama.'],
      'pool-above': ['Piscina no topo', 'Espreguiçadeiras no deck de pedra.'],
      'pool-palms': ['Jardim da piscina', 'Muros de pedra vulcânica e palmeiras.'],
      panorama: ['Sobre o Funchal', 'A cinco minutos do centro, a cidade a seus pés.']
    }
  },
  uk: {
    book: 'Забронювати', back: 'Основний сайт', kicker: 'Прогулянка CBA Suites Madeira', loading: 'Відчиняємо двері…',
    auto: 'Провести мене', stop: 'Пауза', next: 'Далі', prev: 'Назад',
    hint: 'Ведіть мишкою, щоб роззирнутися · натисніть точку, щоб туди піти',
    hintTouch: 'Нахиліть або потягніть, щоб роззирнутися · торкніться точки, щоб туди піти',
    ch: { lobby: 'Лобі', suite: 'Люкс з видом', studio: 'Студія', duplex: 'Дуплекс', pool: 'Басейн' },
    s: {
      lobby: ['Лобі', 'Оксамитові крісла, люстри й келих мадейрського вина на рецепції.'],
      billiards: ['Ігрова кімната', 'Більярд і вінтажний велосипед поруч із лобі.'],
      'living-city': ['Вітальня і їдальня', 'Стіл на чотирьох, телевізор і кухня, спальня — в кінці коридору.'],
      kitchen: ['Кухня', 'Плита, мікрохвильовка, чайник і холодильник.'],
      'suite-sea': ['Вітальня', 'Диван-ліжко, обідній стіл і розсувні двері на терасу.'],
      'suite-bay': ['До тераси', 'Скло від підлоги до стелі й пагорби Фуншала у вікні.'],
      balcony: ['Власна тераса', 'Сланцева підлога, вазони й столик на двох на сонці.'],
      view: ['Вид', 'Увесь амфітеатр Фуншала аж до Атлантики.'],
      'bed-queen': ['Спальня', 'Ліжко queen-size, світильники для читання і відкрита шафа.'],
      'bed-warm': ['Спальня з вікнами', 'Два вікна на місто і щільні штори.'],
      studio: ['Студія', 'Ліжко, диван і шафа в одній світлій кімнаті.'],
      duplex: ['Дуплекс', 'Вітальня внизу, сходи нагору до мансардної спальні.'],
      'duplex-living': ['Вітальня дуплекса', 'Скляні двері на балкон і телевізор.'],
      skylight: ['Мансардне вікно', 'Бухта Фуншала в рамці просто над ліжком.'],
      'pool-above': ['Басейн на даху', 'Шезлонги на кам\'яній терасі.'],
      'pool-palms': ['Сад біля басейну', 'Стіни з вулканічного каменю й пальми.'],
      panorama: ['Над Фуншалом', 'П\'ять хвилин над центром, усе місто під ногами.']
    }
  }
};
