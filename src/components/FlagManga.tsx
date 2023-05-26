import iso6391 from "../../assets/jsons/iso6391.json";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";

const json = iso6391 as { [key: string]: string };

function FlagCode(lang?: string) {
  if (lang == undefined) return undefined;
  if (lang == "zh-hk") return json["zh"];
  const split = lang.split("-");

  if (split[1]) return json[split[1]];
  if (split[0]) return json[split[0]];
  return undefined;
}

function FlagManga(props: { lang?: string }) {
  const { lang } = props;

  const [url, setUrl] = useState<string | undefined>();

  useEffect(() => {
    const code = FlagCode(lang);

    if (code) {
      setUrl(() => `https://www.countryflagicons.com/FLAT/64/${code}.png`);
    }
  }, [lang]);

  return (
    <View>
      {url && <Image className="w-full h-full" source={{ uri: url }} />}
    </View>
  );
}

export default FlagManga;
