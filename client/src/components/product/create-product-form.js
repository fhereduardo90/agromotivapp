import React from 'react';
import { Form, Button, Input, Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const Textarea = Input.TextArea;

const CreateForm = ({
  categories = { data: [] },
  form,
  formItemLayout,
  handleSubmit,
  loading = false,
  onSellerChange = () => {},
  sellers = [],
  tailFormItemLayout,
  values = {},
}) => {
  const { getFieldDecorator } = form;
  const options = sellers.map(d => <Option key={ d.id }>{ d.name } ({ d.email })</Option>);

  return (
    <Form onSubmit={handleSubmit(form)}>
      <FormItem
        {...formItemLayout}
        label="Nombre"
        hasFeedback
      >
        {getFieldDecorator('name', {
          initialValue: values.name || '',
          rules: [{ required: true, message: 'Escribe el nombre de producto', whitespace: true }],
        })(
          <Input placeholder="Flor real" />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="Descripcion"
        hasFeedback
      >
        {getFieldDecorator('description', {
          initialValue: values.description || '',
          rules: [{ required: true, message: 'Escribe una breve descripcion', whitespace: true }],
        })(
          <Textarea autosize placeholder="Describe el producto" />
        )}
      </FormItem>


      { !values.seller && (
        <FormItem
          {...formItemLayout}
          label="Agricultor"
          hasFeedback
        >
          { getFieldDecorator('seller_id', {
            rules: [{ required: true, message: 'Escribe el ID del agricultor' }],
          })(
            <Select
              showSearch
              notFoundContent="No se encontro..."
              onSearch={ onSellerChange }
              filterOption={false}>
              { options }
            </Select>
          ) }
        </FormItem>
      ) }

      <FormItem
        {...formItemLayout}
        label="Categoria"
        hasFeedback
      >
        {getFieldDecorator('category_id', {
          initialValue: values.category ? values.category.id + [] : '',
          rules: [{ required: true, message: 'Selecciona una categoria' }],
        })(
          <Select>
            <Option value="">Seleccionar</Option>
            { categories.data.map( category => {
              return <Option key={ category.id } value={ category.id + [] }>{ category.name }</Option>;
            } ) }
          </Select>
        )}
      </FormItem>
      <FormItem {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" size="large" loading={ loading } disabled={ loading }>{ values.id ? 'Guardar' : 'Crear' }</Button>
      </FormItem>
    </Form>
  );
};

const CreateProductForm = Form.create()(CreateForm);

export default CreateProductForm;