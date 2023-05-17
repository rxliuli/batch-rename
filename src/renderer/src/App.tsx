import { observer } from 'mobx-react-lite'
import { HomeView } from './HomeView'
import { EditView } from './EditView'
import { store } from './store'

export const App = observer(() => {
  return <main className={'dark:bg-black dark:text-white'}>{store.step === 0 ? <HomeView /> : <EditView />}</main>
})
