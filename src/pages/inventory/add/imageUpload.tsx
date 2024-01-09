/* eslint-disable indent */
import { Flex, Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import { ImageButton, ImageContainer, PlaceholderImg } from "./style";
import dummyImage from "../../../assets/Image.svg";
import cancel from "../../../assets/cancel.svg";
import Cloud from "../../../assets/cloud.svg";
import DeleteIcon from "../../../assets/Delete.svg";
import { IImageUpload } from "./addInterface";
import { ModalBox, ModalContainer } from "../../settings/style";
import { useState } from "react";
import { Header } from "../../expenses/style";
import { CancelButton } from "../../sales/style";
import { useLazyQuery } from "@apollo/client";
import { DOWNLOAD_IMAGE } from "../../../schema/image.schema";
import { getImageUrl as getImage } from "../../../helper/image.helper";
import { useDispatch } from "react-redux";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";

const ImageUpload: React.FC<IImageUpload> = ({
  type,
  handleImageUpload,
  images,
  handleImageDelete,
  getImageUrl,
  getServiceImageUrl,
  serviceImages,
  handleServiceImageUpload,
  productImageSearchData,
  productName,
}) => {
  const { blackLight } = Colors;
  const [addPhotos, setAddPhotos] = useState<boolean>(false);
  const dispatch = useDispatch();

  const [downloadImage] = useLazyQuery(DOWNLOAD_IMAGE);

  const handleSelectImage = async (url: string) => {
    dispatch(toggleSnackbarOpen({ message: "Downloading image", color: "INFO" }));
    const image = await downloadImage({
      variables: {
        url: url,
        productName: productName,
      },
    });
    const relativeFilePath = image?.data?.downloadSelectedImage?.relativePath;
    console.log(image.data);
    if (!relativeFilePath) {
      throw Error("Error downloading Image");
    }
    try {
      const response = await fetch(getImage({ localURL: relativeFilePath }));
      const blob = await response.blob();
      const ext = relativeFilePath.split(".").pop();
      const file = new File([blob], "filename." + ext, { type: `image/${ext}` });

      handleImageUpload(file);
    } catch (error) {
      dispatch(
        toggleSnackbarOpen({
          message: `"Error fetching or processing image:", ${error}`,
          color: "DANGERR",
        })
      );
    }
  };

  return (
    <>
      <Flex gap="1rem" width="100%" direction="column" margin="1rem 0 0.5em 0 ">
        <ImageContainer style={{ height: "auto" }} onClick={() => setAddPhotos(true)}>
          {type === "product" && (
            <Flex
              justifyContent="space-between"
              gap="0.625rem"
              width="100%"
              className="upload-container"
            >
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="button-container">
                  {images[index] && (
                    <button onClick={() => handleImageDelete("product", index)}>
                      <img src={DeleteIcon} alt="" />
                      Delete
                    </button>
                  )}
                  <ImageButton
                    style={{ alignItems: "center", justifyContent: "center" }}
                    key={index}
                  >
                    {images.length > index ? (
                      <PlaceholderImg src={getImageUrl(index)} alt="upload" />
                    ) : null}
                    {!getImageUrl(index) && (
                      <Flex direction="column" alignItems="center">
                        <img src={dummyImage} alt="" id="dummy" />
                        <Flex alignItems="center">
                          <img src={Cloud} alt="" id="cloud" />
                          <p>No Photo Added</p>
                        </Flex>
                      </Flex>
                    )}
                  </ImageButton>
                </div>
              ))}
            </Flex>
          )}
          {type === "service" && (
            <Flex
              justifyContent="space-between"
              gap="0.625rem"
              width="100%"
              className="upload-container"
            >
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="button-container">
                  {serviceImages[index] && (
                    <button onClick={() => handleImageDelete("service", index)}>
                      <img src={DeleteIcon} alt="" /> Delete
                    </button>
                  )}
                  <ImageButton
                    style={{ alignItems: "center", justifyContent: "center" }}
                    key={index}
                  >
                    {serviceImages.length > index ? (
                      <PlaceholderImg src={getServiceImageUrl(index)} alt="upload" />
                    ) : null}
                    {!getServiceImageUrl(index) && (
                      <Flex direction="column" alignItems="center">
                        <img src={dummyImage} alt="" id="dummy" />
                        <Flex alignItems="center">
                          <img src={Cloud} alt="" id="cloud" />
                          <p>No Photo Added</p>
                        </Flex>
                      </Flex>
                    )}
                  </ImageButton>
                </div>
              ))}
            </Flex>
          )}
        </ImageContainer>
      </Flex>

      {addPhotos && (
        <ModalContainer>
          <ModalBox position width="65vw" textMargin="0 0">
            <Header style={{ justifyContent: "space-between", margin: "0.4rem 0" }}>
              <h2 style={{ color: blackLight, fontSize: "1.1rem" }}>Upload Images</h2>
              <CancelButton hover onClick={() => setAddPhotos(false)}>
                <img src={cancel} alt="" />
              </CancelButton>
            </Header>
            <Flex width="100%" justifyContent="space-between">
              <Flex overflowY="scroll" width="45%" maxHeight="60vh" direction="column">
                {type === "product" && (
                  <ImageContainer>
                    <input
                      type="file"
                      id="add-i-1"
                      accept="image/*"
                      hidden
                      onChange={(e) => handleImageUpload(e.target?.files?.[0])}
                    />
                    <Flex
                      justifyContent="space-between"
                      gap="0.625rem"
                      width="100%"
                      className="upload-container"
                    >
                      {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="button-container">
                          {images[index] && (
                            <button onClick={() => handleImageDelete("product", index)}>
                              <img src={DeleteIcon} alt="" />
                              Delete
                            </button>
                          )}
                          <ImageButton
                            style={{ alignItems: "center", justifyContent: "center" }}
                            key={index}
                            active={images.length === index}
                            htmlFor={images.length === index ? "add-i-1" : ""}
                          >
                            {images.length > index ? (
                              <PlaceholderImg src={getImageUrl(index)} alt="upload" />
                            ) : null}
                            {!getImageUrl(index) && (
                              <Flex direction="column" alignItems="center">
                                <img src={dummyImage} alt="" id="dummy" />
                                <Flex alignItems="center">
                                  <img src={Cloud} alt="" id="cloud" />
                                  <p>Upload Image</p>
                                </Flex>
                              </Flex>
                            )}
                          </ImageButton>
                        </div>
                      ))}
                    </Flex>
                  </ImageContainer>
                )}
                {type === "service" && (
                  <ImageContainer>
                    <input
                      type="file"
                      id="add-i-2"
                      accept="image/*"
                      hidden
                      onChange={(e) => handleServiceImageUpload(e.target?.files?.[0])}
                    />
                    <Flex
                      justifyContent="space-between"
                      gap="0.625rem"
                      width="100%"
                      className="upload-container"
                    >
                      {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="button-container">
                          {serviceImages[index] && (
                            <button onClick={() => handleImageDelete("service", index)}>
                              <img src={DeleteIcon} alt="" /> Delete
                            </button>
                          )}
                          <ImageButton
                            style={{ alignItems: "center", justifyContent: "center" }}
                            key={index}
                            active={serviceImages.length === index}
                            htmlFor={serviceImages.length === index ? "add-i-2" : ""}
                          >
                            {serviceImages.length > index ? (
                              <PlaceholderImg src={getServiceImageUrl(index)} alt="upload" />
                            ) : null}
                            {!getServiceImageUrl(index) && (
                              <Flex direction="column" alignItems="center">
                                <img src={dummyImage} alt="" id="dummy" />
                                <Flex alignItems="center">
                                  <img src={Cloud} alt="" id="cloud" />
                                  <p>Upload Image</p>
                                </Flex>
                              </Flex>
                            )}
                          </ImageButton>
                        </div>
                      ))}
                    </Flex>
                  </ImageContainer>
                )}
              </Flex>
              <Flex width="45%" maxHeight="60vh" overflowY="scroll" direction="column">
                <h2 style={{ color: blackLight, fontSize: "1.1rem" }}>Suggested Images</h2>
                {productImageSearchData &&
                productImageSearchData?.productImageSearch?.length > 0 ? (
                  <ImageContainer>
                    <Flex
                      justifyContent="space-between"
                      gap="0.625rem"
                      width="100%"
                      className="upload-container"
                    >
                      {productImageSearchData?.productImageSearch?.map((image) => (
                        <ImageButton
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onClick={() => handleSelectImage(image.link)}
                          key={image.link}
                        >
                          <Flex>
                            <img style={{ width: "100%" }} src={image.link} alt="" />
                          </Flex>
                        </ImageButton>
                      ))}
                    </Flex>
                  </ImageContainer>
                ) : (
                  <Flex margin="1rem 0">
                    <Text>
                      No image found, please retry later. You can select images from your device by
                      clicking a card on the left.
                    </Text>
                  </Flex>
                )}
              </Flex>
            </Flex>
          </ModalBox>
        </ModalContainer>
      )}
    </>
  );
};

export default ImageUpload;
