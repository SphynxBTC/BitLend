import { showConnect } from '@stacks/connect'
import { userSession } from '@utils/userSession'

const appName = 'BitLend'; // shown in wallet pop-up
const appIcon = '@assets/stacks.webp'; // shown in wallet pop-up

const authenticate = () => {
  showConnect({
    appDetails: {
      name: appName,
      icon: appIcon,
    },
    userSession,
    onFinish: () => {
      window.location.reload() // reload when user confirms pop-up
    },
    onCancel: () => {},
  })
}

export default authenticate