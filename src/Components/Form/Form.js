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

const Form = ({
  datum,
  rel_datum,
  store,
  rel_type,
  card_edit,
  postSubmit,
  card_display,
  onClose
}) => {
  console.log('datum', store.getData());
  const [formData, setFormData] = useState(datum.data || {}); // Use initial data or empty object

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

  return (
    <Box>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <Box textAlign='left'>
            <span
              style={{
                display: `${datum.to_add || !!rel_datum ? "none" : null}`,
                float: "right",
                cursor: "pointer",
              }}
              className="red-text delete"
              onClick={ () => {
                onClose();
                postSubmit({ delete: true });
              }}
            >
              delete
            </span>
          </Box>
          <div>
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
          </div>
        </div>
        {getEditFields(card_edit)}
        {(rel_type === "son" || rel_type === "daughter") && otherParentSelect()}
        <br />
        <br />
        <Box textAlign='center'>
          <Button type="button" colorScheme="blue" variant="solid" 
          onClick={(e) => {
            e.preventDefault();

            onClose();
            postSubmit(); 
          }}
          >
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Form;
