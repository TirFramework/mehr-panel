import React, { useState, useEffect, useRef } from 'react';
import {
    Form,
    Popover,
    Button,
    Input,
    Space,
    Divider,
    Card,
    Spin,
    Typography,
    message,
    Tooltip
} from 'antd';
import {
    RobotOutlined,
    TranslationOutlined,
    EditOutlined,
    CompressOutlined,
    ExpandOutlined,
    SendOutlined,
    CloseOutlined,
    CheckOutlined,
    BulbOutlined,
    FileTextOutlined,
    SmileOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import axios from '../lib/axios';
import { separationRules } from '../lib/helpers';
import { LabeledFormItem, resolveReadonlyLabel } from '../lib/fieldLabel';
import Readonly from '../blocks/Readonly';
import InputAddonWrapper, { extractAddonOptions } from './InputAddon';

const { TextArea } = Input;
const { Text } = Typography;

// Built-in simple types (no dynamic import needed)
const BUILTIN_TYPES = {
    text: Input,
    textarea: TextArea,
};

// Predefined AI actions with labels and icons (translations for en/de)
const AI_ACTIONS = [
    { key: 'generate', label: { en: 'Generate', de: 'Generieren' }, icon: <BulbOutlined /> },
    { key: 'translate_en', label: { en: 'Translate to English', de: 'Ins Englische übersetzen' }, icon: <TranslationOutlined /> },
    { key: 'translate_de', label: { en: 'Translate to German', de: 'Ins Deutsche übersetzen' }, icon: <TranslationOutlined /> },
    { key: 'translate_fa', label: { en: 'Translate to Persian', de: 'Ins Persische übersetzen' }, icon: <TranslationOutlined /> },
    { key: 'improve_grammar', label: { en: 'Improve Grammar', de: 'Grammatik verbessern' }, icon: <EditOutlined /> },
    { key: 'summarize', label: { en: 'Summarize', de: 'Zusammenfassen' }, icon: <CompressOutlined /> },
    { key: 'expand', label: { en: 'Expand', de: 'Erweitern' }, icon: <ExpandOutlined /> },
    { key: 'make_formal', label: { en: 'Make Formal', de: 'Formell machen' }, icon: <SafetyCertificateOutlined /> },
    { key: 'make_casual', label: { en: 'Make Casual', de: 'Locker machen' }, icon: <SmileOutlined /> },
    { key: 'fix_typos', label: { en: 'Fix Typos', de: 'Tippfehler beheben' }, icon: <FileTextOutlined /> },
];

// UI translations
const UI_TRANSLATIONS = {
    en: {
        aiAssistant: 'AI Assistant',
        processing: 'Processing with AI...',
        customInstruction: 'Custom instruction...',
        cancel: 'Cancel',
        apply: 'Apply',
        textUpdated: 'Text updated',
        enterCustomPrompt: 'Please enter a custom prompt',
        noTextToProcess: 'No text to process',
    },
    de: {
        aiAssistant: 'KI-Assistent',
        processing: 'Wird mit KI verarbeitet...',
        customInstruction: 'Eigene Anweisung...',
        cancel: 'Abbrechen',
        apply: 'Anwenden',
        textUpdated: 'Text aktualisiert',
        enterCustomPrompt: 'Bitte geben Sie eine Anweisung ein',
        noTextToProcess: 'Kein Text zum Verarbeiten',
    },
};

/**
 * AI Field Component
 *
 * A wrapper field that adds AI assistance to text inputs.
 * Supports both Text and Textarea input types.
 *
 * Features:
 * - Predefined AI actions (translate, improve, summarize, expand)
 * - Custom prompt input
 * - Result preview modal with apply/cancel options
 */
const AI = ({
    // Field props from scaffolder
    name,
    display,
    inputType = 'textarea',
    rows = 4,
    aiPrompt = '',
    aiActions = [],
    aiEndpoint = '/ai/text-assist',  // Default endpoint, can be overridden from backend
    locale = 'en',  // Locale for translations (en/de)
    inputOptions = {},  // Component-specific options passed to the dynamic component
    value,
    defaultValue,
    placeholder,
    disable,
    readonly,
    rules,
    creationRules,
    updateRules,
    pageType,
    testId,
    options = {},
    hideLabel,
    comment,
    ...props
}) => {
    const form = Form.useFormInstance();
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [customPrompt, setCustomPrompt] = useState('');
    const [showResultCard, setShowResultCard] = useState(false);
    const [aiResult, setAiResult] = useState('');
    const [fieldValue, setFieldValue] = useState(value || defaultValue || '');
    const [modalCustomPrompt, setModalCustomPrompt] = useState('');
    const cardRef = useRef(null);

    // Get translations based on locale
    const t = UI_TRANSLATIONS[locale] || UI_TRANSLATIONS.en;
    const getActionLabel = (action) => action.label[locale] || action.label.en;

    // Dynamic component loading state
    const [DynamicComponent, setDynamicComponent] = useState(null);
    const [componentLoading, setComponentLoading] = useState(false);
    const [componentError, setComponentError] = useState(null);

    // Check if it's a built-in type or needs dynamic loading
    const inputTypeLower = inputType?.toLowerCase();
    const isBuiltinType = ['text', 'textarea'].includes(inputTypeLower);
    const BuiltinComponent = BUILTIN_TYPES[inputTypeLower];

    // Dynamically load custom component if not a built-in type
    useEffect(() => {
        if (!isBuiltinType && inputType) {
            setComponentLoading(true);
            setComponentError(null);

            // Dynamic import based on inputType name
            import(`./${inputType}.jsx`)
                .then((module) => {
                    setDynamicComponent(() => module.default);
                    setComponentLoading(false);
                })
                .catch((err) => {
                    console.error(`Failed to load component: ${inputType}`, err);
                    setComponentError(`Failed to load component: ${inputType}`);
                    setComponentLoading(false);
                });
        }
    }, [inputType, isBuiltinType]);

    // Get validation rules
    const formRules = separationRules({
        pageType,
        rules,
        creationRules,
        updateRules,
    });

    const { addonBefore, addonAfter, inputOptions: addonInputOptions } =
        extractAddonOptions(options);

    // Filter available actions based on scaffolder config
    const availableActions = aiActions?.length > 0
        ? AI_ACTIONS.filter(a => aiActions.includes(a.key))
        : AI_ACTIONS;

    // Get current field value from form
    const getCurrentValue = () => {
        return form?.getFieldValue(name) || fieldValue || '';
    };

    // Handle field value change
    const handleFieldChange = (e) => {
        setFieldValue(e.target.value);
    };

    // AI mutation for API calls
    const aiMutation = useMutation({
        mutationFn: (data) => axios.post(aiEndpoint, data),
        onSuccess: (response) => {
            setAiResult(response.data.result);
            setPopoverOpen(false);
        },
        onError: (error) => {
            message.error('AI request failed: ' + (error.response?.data?.message || error.message));
            setShowResultCard(false);
        }
    });

    // AI mutation for modal (refining the result)
    const aiRefineModal = useMutation({
        mutationFn: (data) => axios.post(aiEndpoint, data),
        onSuccess: (response) => {
            setAiResult(response.data.result);
        },
        onError: (error) => {
            message.error('AI request failed: ' + (error.response?.data?.message || error.message));
        }
    });

    // Handle predefined action click
    const handleAction = (actionKey) => {
        const currentValue = getCurrentValue();

        // Open floating card immediately with loading state
        setShowResultCard(true);
        setPopoverOpen(false);
        setAiResult('');

        aiMutation.mutate({
            text: currentValue || '',
            action: actionKey,
            system_prompt: aiPrompt || '',
        });
    };

    // Handle custom prompt submit
    const handleCustomPrompt = () => {
        const currentValue = getCurrentValue();
        if (!customPrompt.trim()) {
            message.warning(t.enterCustomPrompt);
            return;
        }

        // Open floating card immediately with loading state
        setShowResultCard(true);
        setPopoverOpen(false);
        setAiResult('');

        aiMutation.mutate({
            text: currentValue || '',
            action: 'custom',
            system_prompt: aiPrompt || '',
            custom_prompt: customPrompt,
        });
    };

    // Apply AI result to the form field
    const handleApply = () => {
        setFieldValue(aiResult);
        form?.setFieldsValue({ [name]: aiResult });
        setShowResultCard(false);
        setAiResult('');
        setCustomPrompt('');
        setModalCustomPrompt('');
        message.success(t.textUpdated);
    };

    // Cancel and close floating card
    const handleCancel = () => {
        setShowResultCard(false);
        setAiResult('');
        setModalCustomPrompt('');
    };

    // Handle AI action in modal (refine current result)
    const handleModalAction = (actionKey) => {
        if (!aiResult) {
            message.warning(t.noTextToProcess);
            return;
        }

        aiRefineModal.mutate({
            text: aiResult,
            action: actionKey,
            system_prompt: aiPrompt || '',
        });
    };

    // Handle custom prompt in modal
    const handleModalCustomPrompt = () => {
        if (!aiResult) {
            message.warning(t.noTextToProcess);
            return;
        }
        if (!modalCustomPrompt.trim()) {
            message.warning(t.enterCustomPrompt);
            return;
        }

        aiRefineModal.mutate({
            text: aiResult,
            action: 'custom',
            system_prompt: aiPrompt || '',
            custom_prompt: modalCustomPrompt,
        });
        setModalCustomPrompt('');
    };

    // Popover content with AI actions
    const popoverContent = (
        <div style={{ width: 200 }}>
            {/* Action buttons as a compact list */}
            <div style={{ margin: '-4px -8px' }}>
                {availableActions.map(action => (
                    <div
                        key={action.key}
                        onClick={() => !aiMutation.isPending && handleAction(action.key)}
                        style={{
                            padding: '6px 12px',
                            cursor: aiMutation.isPending ? 'wait' : 'pointer',
                            fontSize: 13,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <span style={{ color: '#666' }}>{action.icon}</span>
                        <span>{getActionLabel(action)}</span>
                    </div>
                ))}
            </div>

            <Divider style={{ margin: '6px 0' }} />

            {/* Custom prompt input */}
            <Space.Compact style={{ width: '100%' }} size="small">
                <Input
                    size="small"
                    placeholder={t.customInstruction}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    onPressEnter={handleCustomPrompt}
                    disabled={aiMutation.isPending}
                    style={{ fontSize: 12 }}
                />
                <Button
                    size="small"
                    icon={<SendOutlined />}
                    onClick={handleCustomPrompt}
                    loading={aiMutation.isPending}
                />
            </Space.Compact>
        </div>
    );

    // AI button with popover
    const AiButton = (
        <Popover
            content={popoverContent}
            trigger="click"
            open={popoverOpen}
            onOpenChange={setPopoverOpen}
            placement="bottomRight"
        >
            <Tooltip title={t.aiAssistant}>
                <Button
                    type="text"
                    size="small"
                    icon={aiMutation.isPending ? <Spin size="small" /> : <RobotOutlined />}
                    disabled={disable || aiMutation.isPending}
                    style={{
                        color: '#1890ff',
                        padding: '0 4px'
                    }}
                    data-cy={`${testId}-ai-button`}
                />
            </Tooltip>
        </Popover>
    );

    // Floating Result Card component
    const FloatingResultCard = showResultCard && (
        <Card
            ref={cardRef}
            size="small"
            title={
                <Space>
                    <RobotOutlined style={{ color: '#1890ff' }} />
                    <span>{t.aiAssistant}</span>
                </Space>
            }
            extra={
                <Button
                    type="text"
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={handleCancel}
                />
            }
            style={{
                marginTop: 8,
                marginBottom: 16,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                border: '1px solid #1890ff',
                borderRadius: 8,
            }}
        >
            {/* Loading State */}
            {aiMutation.isPending && !aiResult && (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <Spin size="default" />
                    <div style={{ marginTop: 12 }}>
                        <Text type="secondary">{t.processing}</Text>
                    </div>
                </div>
            )}

            {/* Content when loaded */}
            {(!aiMutation.isPending || aiResult) && (
                <>
                    {/* AI Actions Bar */}
                    <div style={{ marginBottom: 10 }}>
                        <Space wrap size={[6, 6]}>
                            {availableActions.map(action => (
                                <Button
                                    key={action.key}
                                    size="small"
                                    icon={action.icon}
                                    onClick={() => handleModalAction(action.key)}
                                    loading={aiRefineModal.isPending}
                                >
                                    {getActionLabel(action)}
                                </Button>
                            ))}
                        </Space>
                    </div>

                    {/* Custom Prompt Input */}
                    <Space.Compact style={{ width: '100%', marginBottom: 10 }}>
                        <Input
                            size="small"
                            placeholder={t.customInstruction}
                            value={modalCustomPrompt}
                            onChange={(e) => setModalCustomPrompt(e.target.value)}
                            onPressEnter={handleModalCustomPrompt}
                            disabled={aiRefineModal.isPending}
                        />
                        <Button
                            size="small"
                            icon={<SendOutlined />}
                            onClick={handleModalCustomPrompt}
                            loading={aiRefineModal.isPending}
                        />
                    </Space.Compact>

                    <Divider style={{ margin: '10px 0' }} />

                    {/* Result Text */}
                    {inputTypeLower === 'text' ? (
                        <Input
                            size="small"
                            value={aiResult}
                            onChange={(e) => setAiResult(e.target.value)}
                        />
                    ) : (
                        <TextArea
                            value={aiResult}
                            onChange={(e) => setAiResult(e.target.value)}
                            rows={5}
                            style={{ fontSize: 13 }}
                        />
                    )}

                    {/* Action Buttons */}
                    <div style={{ marginTop: 10, textAlign: 'right' }}>
                        <Space>
                            <Button size="small" onClick={handleCancel}>
                                {t.cancel}
                            </Button>
                            <Button
                                size="small"
                                type="primary"
                                icon={<CheckOutlined />}
                                onClick={handleApply}
                                disabled={aiMutation.isPending || !aiResult}
                            >
                                {t.apply}
                            </Button>
                        </Space>
                    </div>
                </>
            )}
        </Card>
    );

    // Readonly display
    if (readonly) {
        const { label, inline } = resolveReadonlyLabel({
            display,
            hideLabel,
            inlineLabel: props.inlineLabel,
            options,
        });

        return (
            <Readonly data-cy={testId} label={label} inline={inline} options={options}>
                <div>{value}</div>
            </Readonly>
        );
    }

    // Loading state for dynamic component
    if (!isBuiltinType && componentLoading) {
        return (
            <LabeledFormItem display={display} hideLabel={hideLabel} inlineLabel={props.inlineLabel} options={options} name={name}>
                <Spin size="small" /> Loading component...
            </LabeledFormItem>
        );
    }

    // Error state for dynamic component
    if (!isBuiltinType && componentError) {
        return (
            <LabeledFormItem display={display} hideLabel={hideLabel} inlineLabel={props.inlineLabel} options={options} name={name}>
                <Text type="danger">{componentError}</Text>
            </LabeledFormItem>
        );
    }

    // Render dynamic/custom component
    if (!isBuiltinType && DynamicComponent) {
        return (
            <>
                <div style={{ position: 'relative' }}>
                    <DynamicComponent
                        name={name}
                        display={display}
                        value={value}
                        defaultValue={defaultValue}
                        placeholder={placeholder}
                        disable={disable}
                        readonly={readonly}
                        rules={rules}
                        creationRules={creationRules}
                        updateRules={updateRules}
                        pageType={pageType}
                        testId={testId}
                        options={options}
                        rows={rows}
                        onChange={handleFieldChange}
                        {...inputOptions}
                        {...props}
                    />
                    <div style={{
                        position: 'relative',
                        marginTop: -28,
                        marginBottom: 0,
                        textAlign: 'right',
                        paddingRight: 5,
                    }}>
                        {AiButton}
                    </div>
                </div>
                {FloatingResultCard}
            </>
        );
    }

    // Render Text input with AI suffix
    if (inputTypeLower === 'text') {
        return (
            <>
                <LabeledFormItem
                    display={display}
                    hideLabel={hideLabel}
                    inlineLabel={props.inlineLabel}
                    options={options}
                    name={name}
                    initialValue={value || defaultValue}
                    rules={formRules}
                >
                    <InputAddonWrapper addonBefore={addonBefore} addonAfter={addonAfter}>
                        <Input
                            data-cy={testId}
                            placeholder={placeholder || addonInputOptions?.placeholder}
                            disabled={disable}
                            suffix={AiButton}
                            onChange={handleFieldChange}
                            {...addonInputOptions}
                        />
                    </InputAddonWrapper>
                </LabeledFormItem>
                {FloatingResultCard}
            </>
        );
    }

    // Render Textarea with AI button positioned at top-right
    return (
        <>
            <LabeledFormItem
                display={display}
                hideLabel={hideLabel}
                inlineLabel={props.inlineLabel}
                options={options}
                name={name}
                initialValue={value || defaultValue}
                rules={formRules}
            >
                <InputAddonWrapper addonBefore={addonBefore} addonAfter={addonAfter}>
                    <TextArea
                        data-cy={testId}
                        placeholder={placeholder || addonInputOptions?.placeholder}
                        disabled={disable}
                        rows={rows}
                        onChange={handleFieldChange}
                        {...addonInputOptions}
                    />
                </InputAddonWrapper>
            </LabeledFormItem>
            <div style={{
                position: 'relative',
                marginTop: -28,
                marginBottom: 0,
                textAlign: 'right',
                paddingRight: 5,
            }}>
                {AiButton}
            </div>
            {FloatingResultCard}
        </>
    );
};

export default AI;
