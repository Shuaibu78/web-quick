/* eslint-disable max-len */
import { FunctionComponent } from "react";
import { Box, Header } from "./style";
import cancel from "../../../assets/cancel.svg";
import { Button } from "../../../components/button/Button";
import { useMutation } from "@apollo/client";
import { isLoading } from "../../../app/slices/status";
import { ModalBox } from "../../settings/style";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { Flex } from "../../../GlobalStyles/CustomizableGlobal.style";
import { ICashInflow, IExpenditure } from "../../../interfaces/expenses.interface";
import { DELETE_CASH_INFLOW, DELETE_EXPENDITURE } from "../../../schema/expenses.schema";
import { useAppDispatch } from "../../../app/hooks";
import { Colors } from "../../../GlobalStyles/theme";

interface IProps {
  item: any;
  type: string;
  setOpenDeleteModal: Function;
  refetch: Function;
}

const DeleteCard: FunctionComponent<IProps> = ({ item, setOpenDeleteModal, type, refetch }) => {
  const dispatch = useAppDispatch();

  const [deleteExpenditure] = useMutation<{ DeleteExpenditure: IExpenditure }>(DELETE_EXPENDITURE);
  const [deleteCashInflow] = useMutation<{ DeleteCashInflow: ICashInflow }>(DELETE_CASH_INFLOW);

  const handleDelete = () => {
    if (type === "expense") {
      dispatch(isLoading(true));
      deleteExpenditure({
        variables: {
          expenditureId: item.inflowOrExpenditureId,
        },
      })
        .then((res) => {
          if (res.data) {
            dispatch(isLoading(false));
            setOpenDeleteModal(false);
            refetch();
            dispatch(toggleSnackbarOpen({ message: "Expense Successfully Deleted", color: "SUCCESS" }));
          }
        })
        .catch((err) => {
          dispatch(
            toggleSnackbarOpen({
              message: err.message || err.graphQLErrors[0].message,
              color: "DANGER",
            })
          );
          dispatch(isLoading(false));
        });
    } else {
      dispatch(isLoading(true));
      deleteCashInflow({
        variables: {
          cashInflowId: item.inflowOrExpenditureId,
        },
      })
        .then((res) => {
          if (res.data) {
            dispatch(isLoading(false));
            setOpenDeleteModal(false);
            refetch();
            dispatch(toggleSnackbarOpen({ message: "Cash Inflow Successfully Deleted", color: "SUCCESS" }));
          }
        })
        .catch((err) => {
          dispatch(
            toggleSnackbarOpen({
              message: err.message || err.graphQLErrors[0].message,
              color: "DANGER",
            })
          );
          dispatch(isLoading(false));
        });
    }
  };

  return (
    <ModalBox>
      <Box>
        <Header>
          {/* <div className="cancelCont" onClick={() => setOpenDeleteModal(false)}>
            <img src={cancel} alt="" />
          </div> */}

          <h3>
            Are you sure about deleting this {type === "expense" ? "expense" : "cash inflow"}?
          </h3>
        </Header>
        <Flex alignItems="center" gap="2rem" margin="3rem 0 0 0">
          <Button
            label="Cancel"
            onClick={() => setOpenDeleteModal(false)}
            backgroundColor={Colors.offWhite}
            size="lg"
            fontSize="1rem"
            borderRadius="0.75rem"
            width="100%"
            color="#555353"
            borderColor="transparent"
            borderSize="0px"
          />
          <Button
            label="Delete"
            onClick={() => handleDelete()}
            backgroundColor={Colors.red}
            size="lg"
            fontSize="1rem"
            borderRadius="0.75rem"
            width="100%"
            color="#fff"
            borderColor="transparent"
            borderSize="0px"
          />
        </Flex>
      </Box>
    </ModalBox>
  );
};

export default DeleteCard;
