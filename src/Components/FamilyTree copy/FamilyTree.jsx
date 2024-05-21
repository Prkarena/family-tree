import React, { useRef, useEffect, useState } from "react";
import f3 from "family-chart"; // npm i family-chart
import "./FamilyTree.css"; // create file 'family-chart.css' in same directory, copy/paste css from examples/create-tree
import Form from "../Form/Form";
import Popup from "../Popup/Popup";

const cardEditParams = () => [
  { type: "text", placeholder: "first name", key: "first name" },
  { type: "text", placeholder: "last name", key: "last name" },
  { type: "text", placeholder: "birthday", key: "birthday" },
  { type: "text", placeholder: "avatar", key: "avatar" },
];

const cardDisplay = () => {
  const d1 = (d) =>
    `${d.data["first name"] || ""} ${d.data["last name"] || ""}`;
  const d2 = (d) => `${d.data["birthday"] || ""}`;
  d1.create_form = "{first name} {last name}";
  d2.create_form = "{birthday}";
  return [d1, d2];
};

const FamilyTree = () => {
  const contRef = useRef(null);
  const [formDetails, setFormDetails] = useState("");
  useEffect(() => {
    const cont = document.querySelector("#FamilyChart");
    if (!contRef.current || !cont) return;

    const card_dim = {
      w: 220,
      h: 70,
      text_x: 75,
      text_y: 15,
      img_w: 60,
      img_h: 60,
      img_x: 5,
      img_y: 5,
    };
    const card_edit = cardEditParams();
    const card_display = cardDisplay();

    const initialData = () => [
      {
        id: "0",
        rels: {},
        data: {
          "first name": "Name",
          "last name": "Surname",
          birthday: 1970,
          avatar:
            "https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg",
          gender: "M",
        },
      },
    ];

    const createF3Store = () => {
      return f3.createStore({
        data: initialData(),
        node_separation: 250,
        level_separation: 150,
      });
    };

    const createView = (f3Store) => {
      return f3.d3AnimationView({
        store: f3Store,
        cont: cont,
        card_edit,
      });
    };

    const cardEditForm = (props) => {
      const card_edit = cardEditParams();
      const card_display = cardDisplay();

      const postSubmit = props.postSubmit;
      
      props.postSubmit = (ps_props) => {
        postSubmit(ps_props);
      };
      setFormDetails({ ...props, card_edit, card_display });
    };

    const createCard = (f3Store, view) => {
      const svg = view.svg;
      return f3.elements.Card({
        store: f3Store,
        svg,
        card_dim,
        card_display,
        mini_tree: true,
        link_break: false,
        cardEditForm,
        addRelative: f3.handlers.AddRelative({
          store: f3Store,
          cont,
          card_dim,
          cardEditForm,
          labels: { mother: "Add mother" },
        }),
      });
    };

    const f3Store = createF3Store();
    const view = createView(f3Store);
    const card = createCard(f3Store, view);

    view.setCard(card);
    f3Store.setOnUpdate((props) => view.update(props || {}));
    f3Store.update.tree({ initial: true });
  }, []);

  return (
    <div>
      <Popup
        isModalOpen={!!formDetails}
        handleCloseModal={() => setFormDetails("")}
      >
        <Form {...formDetails} onClose={() => setFormDetails("")} />
      </Popup>
      <div className="f3" id="FamilyChart" ref={contRef} />
    </div>
  );
};

export default FamilyTree;
