import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Container,
  Header,
  SubHeader,
  LoadCont,
  LoadGuage,
  LoadState,
  BHeader,
  BSubHeader,
} from "./style";
import img1 from "../../../assets/slide1.png";
import img2 from "../../../assets/slide2.png";
import { useNavigate } from "react-router-dom";
import { isFigorr } from "../../../utils/constants";

interface ILoader {
  shouldProceed?: boolean;
  isSignup?: boolean;
}

const Loader: FunctionComponent<ILoader> = ({ shouldProceed = false, isSignup }) => {
  const [show, setShow] = useState<number>(1);
  const [loadWidth, setLoadWidth] = useState<number>(Math.floor(Math.random() * 10) + 5);

  const navigate = useNavigate();

  let loadInterval: NodeJS.Timeout;

  const changeLoadWidth = () => {
    if (loadWidth < 100) {
      if (loadWidth < 90) {
        setLoadWidth(loadWidth + (Math.floor(Math.random() * 10) + 5));
      } else {
        setLoadWidth(100);
      }
    }
    if (loadWidth < 100 && loadWidth < 90) {
      setLoadWidth(loadWidth + (Math.floor(Math.random() * 10) + 5));
    } else if (loadWidth < 100 && loadWidth >= 90) {
      setLoadWidth(100);
    }
    if (loadWidth === 100 && shouldProceed) {
      clearInterval(loadInterval);
      navigate("/dashboard");
    }
  };

  const changeSlide = () => {
    if (show === 1) {
      setShow(2);
    } else {
      setShow(1);
    }
  };

  useEffect(() => {
    loadInterval = setInterval(changeLoadWidth, 1000);

    return () => {
      clearInterval(loadInterval);
    };
  }, [loadWidth]);

  useEffect(() => {
    const slideInterval = setInterval(changeSlide, 5000);

    return () => {
      clearInterval(slideInterval);
    };
  }, [show]);

  return (
    <Container>
      <Header>
        Welcome to <a href="/">{isFigorr ? " Figorr" : " Timart"}</a>
      </Header>
      <SubHeader>
        Just a moment, {isSignup ? "creating your account" : "setting up your store"}...
      </SubHeader>
      <div>
        <LoadCont>
          <LoadGuage width={`${loadWidth}%`}></LoadGuage>
        </LoadCont>
        <LoadState>{loadWidth.toFixed(0)}% Complete</LoadState>
      </div>
      <div style={{ width: "100%" }}>
        {show === 1 ? (
          <div>
            {isFigorr ? null : (
              <>
                <img src={img1} alt="" style={{ margin: "1.25rem 0" }} />
                <BHeader>
                  Sell Faster with <a href="/">Timart Online Store</a>
                </BHeader>
                <BSubHeader>
                  Start selling online and make sales 3x faster with Timart online store
                </BSubHeader>
              </>
            )}
          </div>
        ) : (
          <div style={{ width: "100%" }}>
            <img src={img2} alt="" style={{ margin: "1.25rem 0" }} />
            <BHeader>
              Download the <a href="/">{isFigorr ? "Figorr" : "Timart"} Mobile App</a>
            </BHeader>
            <BSubHeader>Stay connected with your business 24/7 with our mobile app.</BSubHeader>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Loader;
