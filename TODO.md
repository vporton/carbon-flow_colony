- We will add a child token only together with calling the ERC-1155 contract setting relationship.
  On removal of a child token, we will reset conversion to zero.

- Motion "will only work if the VotingReputation extension is installed for the Colony that's being acted on"

- Refuse empty login or password.

- Introduce string length limits to reduce spam.

- Rewrite in Material UI.

- Check all `fetch`s for `credentials: "include"`

- Non-MetaMask web3 providers.

- Page 404.

- Ask users to donate for science.

- It seems that repeatedly creating Prisma client I repeatedly connect to a DB.

## How to watch voting result:

Yes, you can watch the MotionFinalized event. See here it's event data: https://docs.colony.io/colonysdk/api/classes/VotingReputation#event-data-4 (you will need to get the motion by the id and do what I said above or wait until I implemented the convenience result function). For an example on how to watch for events see https://github.com/JoinColony/colonyJS/blob/main/packages/sdk/examples/browser/src/events.ts

There is now a `getMotionResult` on the `VotingReputation` class (`colony.ext.motions.getMotionResult(motionId)`) which will return 0 (Nay) or 1 (Yay)
Do `npm i @colony/sdk@next`
You will find the docs for it at https://docs.colony.io/next/ soon