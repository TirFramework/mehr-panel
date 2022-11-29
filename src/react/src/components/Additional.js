import { useEffect, useState } from "react";
import { Button, Col, Row } from "antd";
import Field from "./Field";
import { PlusOutlined, DragOutlined, CloseOutlined } from "@ant-design/icons";
import { findNextName, replaceLastNumberFromString } from "../lib/helpers";
import FormGroup from "./FormGroup";

const Additional = (props) => {
  const [fields, setFields] = useState(props.children);

  //   useEffect(() => {
  //     setFields(props.children);
  //   }, [props]);

  const removeRow = (index) => {
    const newData = [...fields];
    newData.splice(index, 1);
    setFields(newData);
  };

  const duplicate = () => {
    const data = [...fields];

    const templateFilde = [...props.template];

    const newRow = changeName(templateFilde);

    data.push(newRow);
    console.log("🚀 ~ file: Additional.js ~ line 12 ~ duplicate ~ data", data);

    setFields(data);
  };

  const changeName = (arry) => {
    const newData = [...arry];
    newData.forEach((item, index) => {
      if (item.children) {
        newData[index] = {
          ...item,
          children: changeName(item.children),
        };
      } else {
        newData[index] = {
          ...item,
          name: replaceLastNumberFromString(item.name, new Date().getTime()),
          // display: replaceLastNumberFromString(item.name, new Date().getTime()),
          value: "",
        };
      }
    });
    return newData;
  };
  return (
    <>
      {fields.map((child, index) => (
        <Row
          gutter={[16, 16]}
          className="relative"
          key={`additional-group-${index}`}
        >
          {child.map((f, i) => (
            <FormGroup key={`additional-field-${i}`} {...f} />
          ))}
          <Button
            icon={<CloseOutlined />}
            type="text"
            className="remove-btn"
            disabled={props.loading}
            onClick={() => {
              removeRow(index);
            }}
            danger
          />
        </Row>
      ))}

      <Button
        // shape="circle"
        className="w-full"
        disabled={props.loading}
        icon={!props.display && <PlusOutlined />}
        onClick={() => {
          duplicate();
        }}
      >
        {props.display}
      </Button>
    </>
  );
};

export default Additional;

// import update from "immutability-helper";
// import { useCallback, useState } from "react";
// import Card from "./Card.js";
// const style = {
//   width: 400,
// };
// const Additional = () => {
//   const [cards, setCards] = useState([
//     {
//       id: 1,
//       text: "Write a cool JS library",
//     },
//     {
//       id: 2,
//       text: "Make it generic enough",
//     },
//     {
//       id: 3,
//       text: "Write README",
//     },
//     {
//       id: 4,
//       text: "Create some examples",
//     },
//     {
//       id: 5,
//       text: "Spam in Twitter and IRC to promote it (note that this element is taller than the others)",
//     },
//     {
//       id: 6,
//       text: "???",
//     },
//     {
//       id: 7,
//       text: "PROFIT",
//     },
//   ]);
//   const moveCard = useCallback((dragIndex, hoverIndex) => {
//     setCards((prevCards) =>
//       update(prevCards, {
//         $splice: [
//           [dragIndex, 1],
//           [hoverIndex, 0, prevCards[dragIndex]],
//         ],
//       })
//     );
//   }, []);
//   const renderCard = useCallback((card, index) => {
//     return (
//       <Card
//         key={card.id}
//         index={index}
//         id={card.id}
//         text={card.text}
//         moveCard={moveCard}
//       />
//     );
//   }, []);
//   return (
//     <>
//       <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
//     </>
//   );
// };

// export default Additional;
