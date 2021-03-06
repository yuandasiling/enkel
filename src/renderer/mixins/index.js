import { ipcRenderer } from 'electron'
export default {
  methods: {
    $goto (path) {
      ipcRenderer.send('navigate-to', {
        path: path
      })
    },
    S4 () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    },
    getUUID (perfix) {
      return ((perfix ? (perfix + '-') : '') + S4() + '-' + S4())
    }
  }
}