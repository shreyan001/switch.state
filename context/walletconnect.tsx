'use client'

import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { baseSepolia } from '@reown/appkit/networks'

// 1. Get projectId at https://cloud.reown.com
const projectId = 'daa3274daa4c99e492883df7ad15079e'

// 2. Create a metadata object
const metadata = {
  name: 'DaVinciChat',
  description: 'My Website description',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/']
}

// 3. Create the AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks: [baseSepolia],
  projectId,
})

export function AppKit({ children }: { children: React.ReactNode }) {
  return children
}