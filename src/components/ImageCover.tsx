import { Image, View } from "react-native";
import { useMangadexCover } from "~hooks/Mangadex";
import { MangaMangadex } from "~types";

type ImageCoverProps = { blurRadius?: number; item?: MangaMangadex };

function ImageCover(props: ImageCoverProps) {
  const { blurRadius, item } = props;
  const image = useMangadexCover(item);

  return (
    <View
      style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
      className="w-full h-full rounded-lg"
    >
      {image && (
        <Image
          className="w-full h-full rounded-lg"
          source={{ uri: image }}
          blurRadius={blurRadius}
        />
      )}
    </View>
  );
}

export default ImageCover;
