import React from 'react'
import JMDiscover from '@/pages/discover'
import JMRecommend from '../pages/discover/child-pages/recommend'
import JMToplist from '../pages/discover/child-pages/toplist'
import JMSongs from '../pages/discover/child-pages/songs'
import JMDjradio from '../pages/discover/child-pages/djradio'
import JMArtist from '../pages/discover/child-pages/artist'
import JMAlbum from '../pages/discover/child-pages/album'

import JMFriend from '@/pages/friend'
import JMMine from '@/pages/mine'
import { Redirect } from 'react-router-dom'

const routes = [
  { path: '/', exact: true, render: () => <Redirect to="/discover" /> },
  {
    path: '/discover',
    component: JMDiscover,
    routes: [
      { path: '/discover', exact: true, render: () => <Redirect to="/discover/recommend" /> },
      { path: '/discover/recommend', component: JMRecommend },
      { path: '/discover/ranking', component: JMToplist },
      { path: '/discover/album', component: JMAlbum },
      { path: '/discover/djradio', component: JMDjradio },
      { path: '/discover/artist', component: JMArtist },
      { path: '/discover/songs', component: JMSongs }
    ],
  },
  { path: '/mine', component: JMMine },
  { path: '/friend', component: JMFriend },
]

export default routes
