import React, { FunctionComponent, useEffect, useState } from "react";
import arrowL from "../../../assets/ArrowL.svg";
import arrowR from "../../../assets/ArrowR.svg";
import Delete from "../../../assets/Delete.svg";
import Swap from "../../../assets/SwapB.svg";
import Edit from "../../../assets/Edit.svg";
import {
  CustomCont,
  Table,
  THead,
  TBody,
  TRow,
  Td,
  PerPage,
  CurrentPage,
  JumpTo,
} from "../../sales/style";
import { Flex } from "../../../components/receipt/style";
import Checkbox from "../../../components/checkbox/checkbox";
import { PageControl } from "../../inventory/style";
import { sortList } from "../../../utils/helper.utils";
import AddNewCard from "../add-new-card/add-new-card";
import { ModalContainer } from "../../settings/style";
import DeleteCard from "../add-new-card/delete-card";
import { useAppSelector } from "../../../app/hooks";
import { formatAmountIntl } from "../../../helper/format";
import { TEmpty } from "../../home/style";
import { ClippedText } from "../../onlinePresence/style.onlinePresence";
import { Colors } from "../../../GlobalStyles/theme";
import { IInflowExpenditureRecords } from "../expenses";
import { UsersAttr } from "../../../interfaces/user.interface";
import { useQuery } from "@apollo/client";
import { GET_ALL_USER } from "../../../schema/auth.schema";
import { getCurrentShop } from "../../../app/slices/shops";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { useDispatch } from "react-redux";

export type DynamicObject = {
  [key: string]: boolean;
};
interface IProps {
  page: number;
  navBarHeight: number;
  perPage: number;
  totalExpenses: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setPerPage: React.Dispatch<React.SetStateAction<number>>;
  data?: IInflowExpenditureRecords[];
  refetch: Function;
}

interface IRecords extends IInflowExpenditureRecords {
  checked?: boolean;
}

const ProductList: FunctionComponent<IProps> = ({
  page,
  perPage,
  setPage,
  setPerPage,
  data,
  refetch,
  navBarHeight,
  totalExpenses,
}) => {
  const [expenses, setExpenses] = useState<IRecords[]>([]);
  const [selectedItem, setSelectedItem] = useState<IRecords>({} as IRecords);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [type, setType] = useState<string>("");
  const [selectAll, setSelectAll] = useState(false);
  const currentShop = useAppSelector(getCurrentShop);
  const dispatch = useDispatch();

  const { user: userInfo } = useAppSelector((state) => state);
  const { data: allUserData } = useQuery<{
    getAllUsers: UsersAttr[];
  }>(GET_ALL_USER, {
    variables: {
      shopId: currentShop?.shopId,
    },
    skip: !currentShop?.shopId,
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const cashiers = allUserData?.getAllUsers;
  const cashierOption: string[] =
    (allUserData?.getAllUsers?.map((users) => users.fullName) as string[]) || [];
  cashierOption.unshift("All Users");

  useEffect(() => {
    setExpenses(data || []);
    setTotalPages(Math.ceil(totalExpenses / Number(perPage)));
  }, [data, perPage, totalExpenses]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleSelectAll = () => {
    const every = expenses.every((expense) => expense.checked);
    const updatedExpenses = expenses.map((expense) => {
      return { ...expense, checked: !every };
    });
    setExpenses(updatedExpenses);
    setSelectAll(!every);
  };

  const handleSelectRow = (id: string) => {
    const updatedExpenses = expenses.map((expense) => {
      if (expense.inflowOrExpenditureId === id) {
        return { ...expense, checked: !expense.checked };
      }
      return expense;
    });

    const allChecked = updatedExpenses.every((exp) => exp.checked);
    setSelectAll(allChecked);
    setExpenses(updatedExpenses);
  };

  return (
    <div>
      <Table
        overflowX="hidden"
        margin="0"
        width="auto"
        maxWidth="100% !important"
        style={{ margin: "1.5rem 0" }}
      >
        {expenses && expenses.length > 0 && (
          <THead
            fontSize="0.875rem"
            style={{ padding: "0.4rem 0.2rem" }}
            overflowX="hidden"
            width="100%"
            minWidth="100%"
          >
            <Td width="4%">
              <CustomCont imgHeight="100%" height="1.25rem">
                <Checkbox
                  isChecked={selectAll}
                  color="#130F26"
                  size="1.125rem"
                  onChange={handleSelectAll}
                />
              </CustomCont>
            </Td>
            <Td width="24%">
              <span>Name of Transaction</span>
            </Td>
            <Td width="15%">
              <span>Amount (₦)</span>
            </Td>
            <Td width="12%">
              <span>Category</span>
            </Td>
            <Td width="13%">
              <span>User</span>
            </Td>
            <Td width="10%">
              <span>Remarks</span>
            </Td>
            <Td width="12%">
              <span>Date Added</span>
            </Td>
            <Td width="10%">Actions</Td>
          </THead>
        )}
        <TBody
          maxHeight={`calc(100vh - ${navBarHeight! + 150}px)`}
          overflowY="scroll"
          style={{ overflowX: "hidden", paddingRight: "0" }}
          width="100%"
          overflowX="hidden"
        >
          {expenses && expenses?.length > 0 ? (
            expenses.map((val, i) => {
              return (
                <TRow
                  key={i}
                  height="2rem"
                  maxWidth="100%"
                  overflowX="hidden"
                  width="100%"
                  minWidth="100%"
                  style={{
                    padding: "0 0.2rem",
                    color: Colors.blackLight,
                    borderBottom: `1px solid ${Colors.borderGreyColor}`,
                  }}
                >
                  <Td width="4%">
                    <CustomCont imgHeight="100%">
                      <Checkbox
                        isChecked={val.checked!}
                        onChange={() => handleSelectRow(val.inflowOrExpenditureId)}
                        color="#130F26"
                        size="1.125rem"
                      />
                    </CustomCont>
                  </Td>

                  <Td width="24%">
                    <span>{val.name}</span>
                  </Td>
                  <Td width="15%">
                    <span>{formatAmountIntl(undefined, val.amount || 0)}</span>
                  </Td>
                  <Td width="12%">
                    <span>{val?.category}</span>
                  </Td>
                  <Td width="13%">
                    {cashiers?.find((ussr) => ussr.userId === val?.userId)?.fullName ? (
                      <span>{cashiers?.find((ussr) => ussr.userId === val?.userId)?.fullName}</span>
                    ) : (
                      <span>
                        <i>Staff not recorded</i>
                      </span>
                    )}
                  </Td>
                  <Td width="10%">
                    <ClippedText color={Colors.blackLight} maxWidth="70%">
                      <span style={{ textOverflow: "ellipsis", maxHeight: "100%" }}>
                        {val.remark || " Nill"}
                      </span>
                    </ClippedText>
                  </Td>
                  <Td width="12%">
                    <span>
                      {val.date
                        ? new Date(val.date).toDateString()
                        : new Date(val.updatedAt).toDateString()}
                    </span>
                  </Td>
                  <Td width="10%">
                    <CustomCont imgHeight="1.25rem">
                      <Flex
                        style={{
                          cursor:
                            val.isExpenditure === 0 && val.inflowOrExpenditureId === null
                              ? "not-allowed"
                              : "pointer",
                        }}
                        alignItems="center"
                        gap="1.25rem"
                        margin="0 0.625rem 0 0"
                      >
                        <img
                          src={Edit}
                          alt=""
                          onClick={() => {
                            if (val.isExpenditure === 0 && val.inflowOrExpenditureId === null) {
                              dispatch(
                                toggleSnackbarOpen({
                                  message: "You cannot modify sales record from here",
                                  color: "INFO",
                                })
                              );
                            } else {
                              setSelectedItem(val);
                              setOpenModal(true);
                              setType(val.isExpenditure === 1 ? "expense" : "income");
                            }
                          }}
                        />
                        <img
                          src={Delete}
                          alt=""
                          onClick={() => {
                            if (val.isExpenditure === 0 && val.inflowOrExpenditureId === null) {
                              dispatch(
                                toggleSnackbarOpen({
                                  message: "You cannot modify sales record from here",
                                  color: "INFO",
                                })
                              );
                            } else {
                              setOpenDeleteModal(true);
                              setSelectedItem(val);
                              setType(val.isExpenditure === 1 ? "expense" : "income");
                            }
                          }}
                        />
                      </Flex>
                    </CustomCont>
                  </Td>
                </TRow>
              );
            })
          ) : (
            <TEmpty>
              <img src={Swap} alt="empty-img" />
              <h3>No Transaction Record Yet</h3>
              <p>Click on a transaction button above to start adding transactions.</p>
            </TEmpty>
          )}
        </TBody>
        {openModal && (
          <ModalContainer>
            <AddNewCard
              setOpenModal={setOpenModal}
              mode="edit"
              refetch={refetch}
              item={selectedItem}
              type={type}
            />
          </ModalContainer>
        )}
        {openDeleteModal && (
          <ModalContainer>
            <DeleteCard
              setOpenDeleteModal={setOpenDeleteModal}
              refetch={refetch}
              item={selectedItem}
              type={type}
            />
          </ModalContainer>
        )}
      </Table>
      {expenses.length > 0 && (
        <PageControl>
          <PerPage>
            <p>Per page</p>
            <input
              type="number"
              placeholder="perPage"
              value={perPage}
              onChange={(e) => setPerPage(parseInt(e.target.value))}
            />
          </PerPage>
          <CurrentPage>
            <button style={{ opacity: `${page > 1 ? "1" : "0.4"}` }} onClick={handlePrevPage}>
              <img src={arrowL} alt="" />
            </button>
            <div>
              <p>
                <span>{page}</span> of {totalPages}
              </p>
            </div>
            <button
              onClick={handleNextPage}
              style={{ opacity: `${page === totalPages ? "0.4" : "1"}` }}
            >
              <img src={arrowR} alt="" />
            </button>
          </CurrentPage>
          <JumpTo>
            <p>Jump To</p>
            <div>
              <input
                type="number"
                min={totalPages}
                max={1}
                style={{
                  paddingInline: "6px 0.625rem",
                  paddingBlock: "6px",
                  border: "1px solid black",
                }}
                onChange={(e) => setPage(Math.min(totalPages, Number(e.target.value)))}
                placeholder="Page No."
              />
            </div>
          </JumpTo>
        </PageControl>
      )}
    </div>
  );
};

export default ProductList;
