import React, {useMemo, useState, useRef, useEffect} from "react";
import {Empty, Form, Radio, Spin} from "antd";
// import debounce from "lodash/debounce";

import {
    separationRules,
    // removeBaseUrl
} from "../lib/helpers";
import * as api from "../api";

const {Option} = Radio;

const Field = (props) => {

    const [loading, setLoading] = useState(true);

    const [options, setOptions] = useState([]);

    const rules = separationRules({
        pageType: props.pageType,
        rules: props.rules,
        creationRules: props.creationRules,
        updateRules: props.updateRules,
    });


    return (
        <>
            <Form.Item
                name={props.name}
                label={props.display}
                initialValue={props.value}
                rules={rules}
            >
                <Radio.Group
                    mode={props.multiple ? "multiple" : false}
                    options={props.data}
                    disabled={props.readonly}
                    className={props.readonly && 'readOnly'}
                    allowClear={!props.readonly && true}
                    optionType="button"
                    buttonStyle="solid"
                >
                </Radio.Group>
            </Form.Item>
        </>
    );
};

export default Field;
