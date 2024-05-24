import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Input,
  Select,
  Textarea,
  Box,
  Button,
} from "@chakra-ui/react";
import Loader from "../Loader/Loader";
import {
  deleteFamilyMember,
  saveFamilyMember,
} from "../../Services/apis/family";

const Form = (props) => {
  const {
    datum,
    rel_datum,
    store,
    rel_type,
    card_edit,
    postSubmit,
    card_display,
    onClose,
  } = props;

  const [formData, setFormData] = useState(datum.data || {}); // Use initial data or empty object
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(datum.data || {}); // Update form data when props change
  }, [datum.data]);

  const getEditFields = (card_edit) => {
    return card_edit.map((d) => {
      if (d.type === "text") {
        return (
          <FormControl key={d.key} my={4}>
            <FormLabel htmlFor={d.key}>{d.placeholder}</FormLabel>
            <Input
              id={d.key}
              name={d.key}
              value={formData[d.key] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
            />
          </FormControl>
        );
      } else if (d.type === "textarea") {
        return (
          <FormControl key={d.key} my={4}>
            <FormLabel htmlFor={d.key}>{d.placeholder}</FormLabel>
            <Textarea
              id={d.key}
              name={d.key}
              value={formData[d.key] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
            />
          </FormControl>
        );
      }
      return null;
    });
  };

  const otherParentSelect = () => {
    const data_stash = store.getData();
    if (!rel_datum.rels.spouses || rel_datum.rels.spouses.length === 0) {
      return <p>No spouses found.</p>;
    }

    return (
      <FormControl key="other_parent" my={4}>
        <FormLabel htmlFor="other_parent">Select other parent</FormLabel>
        <Select
          id="other_parent"
          name="other_parent"
          value={formData.other_parent || ""}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
        >
          {rel_datum.rels.spouses.map((sp_id, i) => {
            const spouse = data_stash.find((d) => d.id === sp_id);
            return (
              <option key={sp_id} value={sp_id}>
                {card_display[0](spouse)}
              </option>
            );
          })}
          <option value="_new">NEW</option>
        </Select>
      </FormControl>
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: add api call here to save data to db and after that update state in tree
      const requestData = {
        id: formData?.id || "",
        data: formData,
        main: datum.main,
        rels: datum.rels,
      };
      console.log("formData", requestData);
      const result = await saveFamilyMember(requestData);

      if (result.error) {
        throw result.error;
      }

      setTimeout(() => {
        Object.keys(formData).forEach((k) => (datum.data[k] = formData[k]));
        setIsLoading(false);
        onClose();
        // postSubmit(formData);
        postSubmit();
      }, 3000);
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
    }
  };

  const handleDeleteMember = async () => {
    if (formData.id) {
      try {
        setIsLoading(true);
        // TODO: add api call here to save data to db and after that update state in tree
        const result = await deleteFamilyMember(formData.id);

        if (result.error) {
          throw result.error;
        }

        setTimeout(() => {
          onClose();
          postSubmit({ delete: true });
        }, 3000);
      } catch (error) {
        console.log("error", error);
        setIsLoading(false);
      }
    } else {
      onClose();
      postSubmit({ delete: true });
    }
  };

  return (
    <Box p="30px">
      {isLoading && <Loader />}

      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <Box
            display="flex"
            justifyContent="flex-end"
            style={{
              display: `${datum.to_add || !!rel_datum ? "none" : null}`,
              float: "right",
              cursor: "pointer",
            }}
            className="red-text delete"
            color="red"
            onClick={handleDeleteMember}
            cursor="pointer"
            zIndex="2"
          >
            delete
          </Box>
          <Box display="flex" paddingTop="10px">
            <FormControl isRequired my={4}>
              <FormLabel>Gender</FormLabel>
              <RadioGroup
                name="gender"
                value={formData.gender || "M"}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              >
                <Radio value="M" isChecked={formData.gender === "M"}>
                  Male
                </Radio>
                <Radio value="F" isChecked={formData.gender === "F"}>
                  Female
                </Radio>
              </RadioGroup>
            </FormControl>
          </Box>
        </div>
        {getEditFields(card_edit)}
        {(rel_type === "son" || rel_type === "daughter") && otherParentSelect()}
        <br />
        <br />
        <Box textAlign="center">
          <Button
            type="button"
            colorScheme="blue"
            variant="solid"
            onClick={handleFormSubmit}
          >
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Form;
