import { observer } from 'mobx-react-lite'
import { DragFiles } from './DragFiles'
import { EditFileName } from './EditFileName'
import { store } from './store'

export const App = observer(() => {
  return store.step === 0 ? <DragFiles /> : <EditFileName />
})
