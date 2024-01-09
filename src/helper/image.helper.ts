import axios from "axios";
import { IImage } from "../interfaces/image.interface";
import { getItemAsObject } from "../utils/localStorage.utils";
import TShirt from "../assets/ProductImg.png";

interface IUpload {
  files: any;
  key?: string;
  id?: string;
  shopId: string;
  token: string;
}

const queryWithFormData = async (formData: FormData, token: string, queryUrl: string) => {
  return await axios({
    method: "post",
    url: `${process.env.REACT_APP_LOCAL_GRAPHQL_API}/${queryUrl}`,
    data: formData,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const upload = async ({
  files,
  key,
  id,
  shopId,
  token,
}: IUpload): Promise<{ success: boolean; images: IImage[] }> => {
  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  if (key && id) formData.append(key, id);

  if (shopId !== "") formData.append("shopId", shopId);

  const response = await queryWithFormData(formData, token, "uploadImage");
  return response.data;
};

export function getCurrentHost() {
  const url = new URL(window.location.href);

  // TODO: avoid hard coding the port number
  if (!url.port || url.port === "3000") {
    url.port = process.env.REACT_APP_SERVER_PORT || "";
  }

  return url.host;
}
export const getImageUrl = (images: IImage | IImage[] = []): string => {
  // If images is an array, return the localURL of the first image (if available)
  if (Array.isArray(images)) {
    if (images.length === 0 || !images[0]?.localURL) {
      return TShirt;
    }
    return `http://${getCurrentHost()}/resources/${images[0].localURL}`;
  }

  // If images is not an array but a single image object, return its localURL (if available)
  if (!images?.localURL) {
    return TShirt;
  }
  return `http://${getCurrentHost()}/resources/${images.localURL}`;
};
