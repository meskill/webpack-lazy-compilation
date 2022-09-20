import { createElement } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { App } from './render'

hydrateRoot(document.getElementById("application"), createElement(App))