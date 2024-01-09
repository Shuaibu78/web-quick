import ListStar from "../../../assets/SubsCardListDecor.svg";

const SpecialListItem = ({ listItem }: { listItem: string }) => {
  return (
    <div style={{ display: "flex", columnGap: ".2rem", marginBlock: ".8rem" }}>
      <img src={ListStar} alt="" />
      <p style={{ color: "#4F4F4F" }}>{listItem}</p>
    </div>
  );
};

export default SpecialListItem;
