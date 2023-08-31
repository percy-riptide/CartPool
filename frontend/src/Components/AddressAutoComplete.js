import React, { useCallback, useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Form } from "react-bootstrap";

function AddressAutoComplete(props) {
  const [address, setAddress] = useState("");

  const handleSelect = useCallback(
    (address) => {
      geocodeByAddress(address)
        .then((results) => getLatLng(results[0]))
        .then((latLng) => {
          if(props.addressFunction)
          {
            props.addressFunction(address,latLng);
          }
          if(props.setOrderAddress)
          {
            props.setOrderAddress(latLng,address);
          }
          if(props.onClick)
          {
            props.onClick(address, latLng);
        
          }
          setAddress(address);
           
        })
        .catch((error) => console.error("Error", error));
    },
    [props]
  );

  const getInputPropsMemoized = useCallback(
    () => ({
      placeholder: "Enter an address",
      className: "form-control",
    }),
    []
  );

  return (
    <>
      <Form.Group>
        <PlacesAutocomplete
          value={address}
          onChange={setAddress}
          onSelect={handleSelect}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div>
              <Form.Control
                {...getInputProps(getInputPropsMemoized())}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const style = {
                    backgroundColor: suggestion.active ? "#41b6e6" : "#fff",
                  };

                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        style,
                      })}
                      key={suggestion.placeId}
                    >
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </Form.Group>
    </>
  );
}

export default AddressAutoComplete;