import { showConnect } from '@stacks/connect'
import { userSession } from '@utils/userSession'
import reload from "@utils/reload"


const authenticate = () => {
  const appName = 'BitLend'; // shown in wallet pop-up
  const appIcon = `${window.location.origin}/logo.jpg`; // shown in wallet pop-up
  
  showConnect({
    appDetails: {
      name: appName,
      icon: appIcon,
    },
    userSession,
    onFinish: () => {
      reload() // reload when user confirms pop-up
    },
    onCancel: () => {},
  })
}

export default authenticate