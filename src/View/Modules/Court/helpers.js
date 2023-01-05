import { DEFAULT_SUBSTRATE_ACCOUNTS_IDS } from "./constants";

export const getJuror = (address) => {
  switch (address) {
    case DEFAULT_SUBSTRATE_ACCOUNTS_IDS.ALICE:
      return "Alice";
    case DEFAULT_SUBSTRATE_ACCOUNTS_IDS.ALICE_STASH:
      return "Alice Stash";
    case DEFAULT_SUBSTRATE_ACCOUNTS_IDS.BOB:
      return "Bob";
    case DEFAULT_SUBSTRATE_ACCOUNTS_IDS.BOB_STASH:
      return "Bob Stash";
    case DEFAULT_SUBSTRATE_ACCOUNTS_IDS.CHARLIE:
      return "Charlie";
    case DEFAULT_SUBSTRATE_ACCOUNTS_IDS.DAVE:
      return "Dave";
    case DEFAULT_SUBSTRATE_ACCOUNTS_IDS.EVE:
      return "Eve";
    case DEFAULT_SUBSTRATE_ACCOUNTS_IDS.FERDIE:
      return "Ferdie";
    default:
      return address;
  }
};
