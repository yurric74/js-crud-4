// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Track {
  //статич.частное поле для сохраненияя списка объектов Track
  static #list = []

  constructor(name, author, image) {
    //генерируем случайный id
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.author = author
    this.image = image
  }

  //Статич.метод для создания объекта Track и добавление его в список #list
  static create(name, author, image) {
    const newTrack = new Track(name, author, image) //создаём трек
    this.#list.push(newTrack) //кладём трек в список
    return newTrack //возвращаем трек
  }
  //Статич.метод для получения всего списка треков
  static getList() {
    return this.#list.reverse()
  }
  //===============================
  //Статич.метод для получения определённого  трека
  static getById(id) {
    return this.track(id)
  }
}

Track.create(
  'Інь Ян',
  'MONATIC i ROXOLANA',
  'https://picsum.photos/100/100',
)
Track.create(
  'Baila Conmigo (Remix)',
  'Selena Gomez i Rauw Alejandro',
  'https://picsum.photos/100/100',
)
Track.create(
  'Shameless',
  'Camila Cabello',
  'https://picsum.photos/100/100',
)
Track.create(
  'DAKITI',
  'BAD BUNNY i JHAY',
  'https://picsum.photos/100/100',
)
Track.create(
  '11 PM',
  'Maluma',
  'https://picsum.photos/100/100',
)
Track.create(
  'Інша любов',
  'Enleo',
  'https://picsum.photos/100/100',
)
console.log(Track.getList())

class Playlist {
  //Статич.поле для сохранения списка объектов Playlist
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/100/100'
  }
  //статич.метод для создания объекта Playlist и добавления его к списку #list
  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }
  //статичюметод для получения всего списка плейлистов
  static getList() {
    return this.#list.reverse()
  }
  static makeMix(playlist) {
    //создаём 3 рандомных трека, принимает уже созданный объект playlist
    const allTracks = Track.getList() //получаем список всех треков

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random()) //обрезаем треки до 3 штук
      .slice(0, 3)
    playlist.tracks.push(...randomTracks) //отправляем рандомніе треки в playlist
  }
  static getById(id) {
    //по id находим опред плейлист
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }
  deleteTrackById(trackId) {
    //фильтруем треки и удаляем трек с опред id
    this.tracks = this.tracks.filter(
      //по id находим трек в списке треков и удаляем
      (track) => track.id !== trackId,
    )
  }
  //найти список плейлистов по Value а Value это NAME
  static findListByValue(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
  addTrackById(trackId) {
    this.tracks = Playlist.tracks.push(
      (track) => track.id !== trackId,
    )
  }
}
Playlist.makeMix(Playlist.create('Test'))
Playlist.makeMix(Playlist.create('Test2'))
Playlist.makeMix(Playlist.create('Test3'))
//=====================================
router.get('/', function (req, res) {
  const id = Number(req.query.id) //получаем id из query
  const playlistId = Playlist.getById(id) //получаем по id плейлист
  const playlist = Playlist.getList(playlistId)
  Playlist.getList(playlistId)
  //по умолч строка поиска пустая
  const list = []
  const value = []
  //находим список
  // const list = playlist.getList(playlist.id)
  res.render('spotify-playlist-list', {
    style: 'spotify-playlist-list',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
      playlist: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

//===============================
router.get('/spotify-choose', function (req, res) {
  res.render('spotify-choose', {
    style: 'spotify-choose',
    data: {},
  })
})

//===============================
router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  console.log(isMix)
  res.render('spotify-create', {
    style: 'spotify-create',
    data: {
      isMix,
    },
  })
})
//создание плейлиста
router.post('/spotify-create', function (req, res) {
  // console.log(req.body, req.query)
  const isMix = !!req.query.isMix
  const name = req.body.name
  if (!name) {
    return res.render('alert', {
      style: 'alert',
      data: {
        isMix,
        message: 'Помилка',
        info: 'Введіть назву плейлиста',

        link: isMix
          ? `/spotify-create?isMix=true`
          : '/spotify-create',
      },
    })
  }
  //здесь будет код отвечающий за создание нашего плейлиста
  //создание плейлиста в этом POST
  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }
  console.log(playlist)
  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// //=============================
router.get('spotify-playlist', function (req, res) {
  const id = Number(req.query.id) //получаем id из query
  const playlist = Playlist.getById(id) //получаем по id плейлист
  //если плейлиста нет , то
  if (!playlist) {
    //такая ошибка
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: `/`,
      },
    })
  }
  //иначе...
  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// //==============
router.get('/spotify-track-delete', function (res, req) {
  const playlistId = Number(req.query.playlistId) //получаем id плейлиста
  const trackId = Number(req.query.trackId) //получаем id трека
  const playlist = Playlist.getById(playlistId) //получаем cам плейлист
  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        //если нет плелиста то возвращаемся
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }
  //удаляем ненужный трек
  playlist.deleteTrackById(trackId)
  //возвращаем те же данные но без удалённого трека
  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

//подключаем рщутер к бэк-энду
module.exports = router
// //========END======//

router.get('/spotify-search', function (req, res) {
  //по умолч строка поиска пустая
  const value = ''
  //находим список
  const list = Playlist.findListByValue(value)
  //возвращаем страницу  и в неё value
  res.render('spotify-search', {
    style: 'spotify-search',
    //   ...rest - это все свойства одного плейлиста
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})
//при нажатии на поиск отправляется POST запрос
router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''
  //данные из value вытягиваются и получаем список плелистов по value
  const list = Playlist.findListByValue(value)
  console.log(value)

  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

// //===============
router.get('/spotify-playlist-add', function (req, res) {
  // const playlistId = Number(req.query.playlistId) //получаем id плейлиста
  // const trackId = Number(req.query.trackId) //получаем id трека
  // // const playlist = Playlist.getById(playlistId.id) //получаем cам плейлист
  // const tracks = Track.getList(playlistId)
  // if (playlist) {
  //   const success = playlist.addTrack(trackId)
  //   if (success) {
  //     res.render('spotify-playlist-list', {
  //       style: 'spotify-playlist-list',
  //       data: {
  //         playlistId: playlist.id,
  //         // tracks: Track.getList(),
  //         tracks: playlist.tracks,
  //         name: playlist.name,
  //       },
  //     })
  //   } else {
  //     return res.render('alert', {
  //       style: 'alert',
  //       data: {
  //         message: 'Помилка',
  //         info: 'Трек не знайдено',
  //         link: `/spotify-create?isMix=true`,
  //       },
  //     })
  //   }
  // } else {
  //   return res.render('alert', {
  //     style: 'alert',
  //     data: {
  //       message: 'Помилка',
  //       info: 'Такого плейлиста не знайдено',
  //       link: `/spotify-choose`,
  //     },
  //   })
  // }
  const playlistId = Number(req.query.playlistId) //получаем id плейлиста
  const trackId = Number(req.query.trackId) //получаем id трека
  const playlist = Playlist.getById(playlistId) //получаем cам плейлист
  // const tracks = Track.getById(trackId)
  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        //если нет плелиста то возвращаемся
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }
  //добавляем нужный трек
  playlist.addTrackById(trackId)
  Track.getList()
  //возвращаем те же данные но с новым треком
  res.render('spotify-playlist-list', {
    style: 'spotify-playlist-list',
    data: {
      playlist: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

module.exports = router
