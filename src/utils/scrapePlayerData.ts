type UserpageNextData = {
  props: {
    pageProps: {
      _sentryTraceData: string;
      _sentryBaggage: string;
      slug: string;
      user: {
        nick: string;
        created: string;
        userId: string;
        isProUser: boolean;
        isBanned: boolean;
        isVerified: boolean;
        flair: number;
        url: string;
        countryCode: string;
        pin: {
          url: string;
          anchor: string;
          isDefault: boolean;
          path: string;
        };
        streakMedals: null;
        explorerMedals: null;

        lastNameChange: string;
        nameChangeAvailableAt: null;
        fullBodyPin: string;
        isBotUser: boolean;
        suspendedUntil: null;
        type: string;
        isCreator: boolean;
        avatar: {
          fullBodyPath: string;
        };
      };
    };
  };
};
const extractNextData = <T>(htmlString: string) => {
  try {
    // Match the script tag containing __NEXT_DATA__
    const match =
      /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s.exec(
        htmlString,
      );

    if (!match?.[1]) {
      throw new Error("__NEXT_DATA__ script content not found");
    }

    // Parse the JSON content
    const nextData = JSON.parse(match[1]) as T;
    return nextData;
  } catch (error) {
    console.error("Error extracting __NEXT_DATA__:", error);
    return null;
  }
};

export const scrapeGeoguessrPlayerData = async (userId: string) => {
  const geoguessrUser = await fetch(`https://www.geoguessr.com/user/${userId}`);
  if (!geoguessrUser.ok) {
    if (geoguessrUser.status === 404) {
      throw new Error("Invalid Geoguessr user");
    } else {
      throw new Error("Error uploading file");
    }
  }

  const html = await geoguessrUser.text();
  const nextData = extractNextData<UserpageNextData>(html);
  if (!nextData) {
    throw new Error("Error extracting __NEXT_DATA__");
  }
  return {
    geoguessrId: nextData.props.pageProps.user.userId,
    avatarUrl: nextData.props.pageProps.user.avatar.fullBodyPath,
    nick: nextData.props.pageProps.user.nick,
    countryCode: nextData.props.pageProps.user.countryCode,
    id: userId,
  };
};
