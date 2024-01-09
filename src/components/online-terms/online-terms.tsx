import { FunctionComponent, useState } from "react";
import Image from "../../assets/business-ecommerce.svg";
import Cancel from "../../assets/cancel.svg";
import { Flex, Text, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { Container, ToggleButton } from "./style";
import { Colors } from "../../GlobalStyles/theme";
import checkIcon from "../../assets/check.svg";
import { Button } from "../button/Button";

const { lightBlue, primaryColor, primaryGrey } = Colors;
interface Props {
  setShowTerms: Function;
  handleActivate: Function;
  setIncompleteSettings: Function;
  incompleteSettings: boolean;
}
const OnlineTerms: FunctionComponent<Props> = ({
  setShowTerms,
  handleActivate,
  incompleteSettings,
}) => {
  const [agreement, setAgreement] = useState<boolean>(false);

  return (
    <>
      <Flex justifyContent="flex-end" margin="0 0 0.625rem 0">
        <img
          src={Cancel}
          alt=""
          style={{ width: "0.9375rem", cursor: "pointer" }}
          onClick={() => setShowTerms(false)}
        />
      </Flex>
      <Container>
        <img src={Image} alt="" style={{ width: "18.75rem" }} />
        <Flex direction="column" width="100%" gap="1rem">
          <Text color={lightBlue} fontSize="1rem">
            By choosing to go live with your products through online presence, you are agreeing to
            the terms and conditions of use. Please take the time to go through as this document is
            legally binding. Toggling the online presence button means that your products will be
            displayed online at (tmart.com.ng) for the general public to access, view and make
            purchase at any time and from anywhere in the world.
          </Text>
          <Span color={primaryColor} fontSize="1rem" fontWeight="700">
            Remaining connected
          </Span>
          <Text color={lightBlue} fontSize="1rem">
            The online presence button will remain on as long as you perform your daily inventory
            and sales recording on the Timart business app (TBA). If the system detects dormancy
            (I.e no activity on the timart business app) for a period longer than 7 days, the online
            presence button will automatically be toggled off. This is to ensure that only products
            from active sellers are displayed on tmart.com.ng so that customers do not place orders
            that will not be attended to. All prices must be updated by sellers as soon as there is
            a change in price. When customers place orders and their orders are unable to be
            completed due to outdated prices, the user will be suspected from the e-commerce site
            for a period ranging from 1 week to a month as seen fit by the tmart.com.ng team.
          </Text>
          <Span color={primaryColor} fontSize="1rem" fontWeight="700">
            Fulfilling orders and deliveries
          </Span>
          <Text color={lightBlue} fontSize="1rem">
            For orders within Abuja FCT, and Minna, Niger State, sellers are urged to use Timart
            Logistic to ensure Customer goods are protected and delivered intact and on time. Timart
            is not responsible for orders delivered using other services. For orders outside of
            Abuja or Minna, Niger State, sellers are urged to use other means of delivery available
            to them including motor parks and other logistics services. The Timart team is working
            hard to partner with other logistics companies outside Minna, Niger State to ensure safe
            and smooth delivery of products.
          </Text>
          <Span color={primaryColor} fontSize="1rem" fontWeight="700">
            Payment methods
          </Span>
          <Text color={lightBlue} fontSize="1rem">
            We only have two Payment methods available to customers accessing your products on
            Timart E-commerce; Pay online using credit card details or Pay on delivery. Customers
            are protected for online payment, which means customers can pay online for their goods.
            The payment comes to Timart while you offer the product for delivery. Upon receipt by
            the customer, Timart remits your money to you. This comes with extra transaction token
            charges for customers that decide to pay online through our online payment gateway i.e
            these costs will be borne by the Customer.\nAfter successfully delivery, the payment of
            the item together with the shipping cost (if the seller chooses to handle the shipping)
            will be deposited directly into the seller&aposs account between 1 - 7 days after the
            successful delivery of the item to the Customer.\nSame for pay on delivery, Customers
            pay for goods on delivery at their door steps. They can either pay with cash which will
            be remitted into the seller&aposs account by Timart as stated above.
          </Text>
          <Span color={primaryColor} fontSize="1rem" fontWeight="700">
            Faulty products and disputes
          </Span>
          <Text color={lightBlue} fontSize="1rem">
            What makes a faulty product- if it is determined that the product offered by you (the
            seller) does not meet the standard it was presented on tmart.com.ng. it is designated a
            faulty product. Failure to meet the standard could be a variation in size, color,
            quantity, or fails to function as described, or simply does not meet the requirements of
            its advertisement. The seller is legally bound to either replace the product or retract
            it. All extra charges resulting from this will be incurred by the seller. The seller may
            face disciplinary action including but not limited to ban from Timart services and other
            legal action.
          </Text>
          <ToggleButton
            onClick={() => setAgreement(!agreement)}
            isActive={agreement}
            style={{ width: "100%" }}
            color={primaryColor}
          >
            <Flex width="100%" direction="column" alignItems="flex-start">
              <Flex width="100%" alignItems="center">
                <span>{agreement && <img src={agreement && checkIcon} alt="" />}</span>
                <p className="title">Agree to our Terms and conditions</p>
              </Flex>
            </Flex>
          </ToggleButton>
          <Button
            label={incompleteSettings ? "Try Again" : "Activate"}
            type="submit"
            height="3.125rem"
            width="100%"
            disabled={!agreement}
            backgroundColor={incompleteSettings ? primaryGrey : primaryColor}
            size="lg"
            color="#fff"
            borderColor="transparent"
            borderRadius="0.75rem"
            borderSize="1px"
            fontSize="1.1rem"
            onClick={(e) => (incompleteSettings ? setShowTerms(false) : handleActivate(e))}
          />
        </Flex>
      </Container>
    </>
  );
};

export default OnlineTerms;
