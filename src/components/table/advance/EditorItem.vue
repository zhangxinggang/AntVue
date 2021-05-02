<template>
	<div>
    <div v-if="editor.type === 'switch'">
      <a-switch
        v-model="editor._value"
        v-bind="props"
        :checked-children="(editor.options && switchText(editor.options,true))"
        :un-checked-children="(editor.options && switchText(editor.options,false))"
				@change="onChange"
      />
    </div>
    <div v-else-if="editor.type === 'time'">
      <a-time-picker
        style="width:100%"
        v-model="editor._value"
        v-bind="props"
        :format="getFormat(editor)"
        @change="onChange"
        :getPopupContainer="getPopupContainer"
      />
    </div>
    <div v-else-if="editor.type === 'date'">
      <a-date-picker
        style="width:100%"
        v-model="editor._value"
        v-bind="props"
        :format="getFormat(editor)"
        @change="onChange"
        :getPopupContainer="getPopupContainer"
      />
    </div>
    <div v-else-if="editor.type === 'datetime'">
      <a-date-picker
        style="width:100%"
        v-model="editor._value"
        v-bind="props"
        :format="getFormat(editor)"
        @change="onChange"
        show-time
        :getPopupContainer="getPopupContainer"
      />
    </div>
    <div v-else-if="editor.type === 'select'">
      <a-select
        style="width:100%"
        :allowClear="true"
        v-model="editor._value"
				v-bind="props"
        :options="editor.options | selectOptions"
        :getPopupContainer="getPopupContainer"
        @change="onChange"
      />
    </div>
		<div v-else-if="editor.type === 'treeselect'">
		  <a-tree-select
		    style="width:100%"
		    :allowClear="true"
		    v-model="editor._value"
				v-bind="props"
		    :tree-data="editor.options | treeSelectOptions"
		    :getPopupContainer="getPopupContainer"
		    @change="onChange"
		  />
		</div>
		<div v-else-if="editor.type === 'number'">
			<a-input-number
				style="width:100%"
				v-model="editor._value"
				v-bind="props"
				:allowClear="true"
				@change="onChange"
				@blur="checkValue"
			/>
		</div>
		<div v-else-if="editor.type === 'textarea'">
			<a-textarea
				style="width:100%"
				v-model="editor._value"
				v-bind="props"
				@change="onChange"
				@blur="checkValue"
			/>
		</div>
    <div v-else>
      <a-input
        style="width:100%"
        :allow-clear="true"
        v-model="editor._value"
        v-bind="props"
				@change="onChange"
        @blur="checkValue"
      />
    </div>
	</div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'editor-item',
		props:{
			editor: { type: Object, default(){return {}}},
		},
    filters:{
      selectOptions:function(options){
        let formatter = typeof(options.formatter) == "function" ? options.formatter : null
        let valueField = options['valueField'] || 'id'
        let textField = options['textField'] || 'text'
        let data = options.data || []
        let so = data.map(item=>{
          item['value'] = item[valueField]
					valueField!='value' && (delete item['value'])
          item['title'] = formatter ? formatter(item) : item[textField]
					textField!='title' && (delete item[textField])
          return item
        })
        return so
      },
			treeSelectOptions:function(options){
				let formatter = typeof(options.formatter) == "function" ? options.formatter : null
				let valueField = options['valueField'] || 'id'
				let textField = options['textField'] || 'text'
				let treeData = options.data || []
				let repalceTreeField = (arr) =>{
					for(let i=0;i<arr.length;i++){
						arr[i]['value'] = arr[i][valueField]
						valueField!='value' && (delete arr[i][valueField])
						arr[i]['title'] = arr[i][textField]
						textField!='title' && (delete arr[i][textField])
						if(arr[i]['children']){
							repalceTreeField(arr[i]['children'])
						}
					}
				}
				repalceTreeField(treeData)
				return treeData
			}
    },
    data() {
      return {
        timeType:{
          time:'HH:mm:ss',
          date:'YYYY-MM-DD',
          datetime:'YYYY-MM-DD HH:mm:ss'
        },
				inputTypes:{
					time:['time','date','datetime'],
					switch:['switch'],
					number:['number']
				}
      }
    },
    watch:{
      'editor.value':{
        handler(val){
          this.formatterValue()
        },
        immediate: true
      }
    },
		computed:{
			props(){
				let props = this.editor['props'] || {}
				let bindProps = {}
				for(let key in props){
					//去掉浏览器自带的请输入此字段提示
					if(key != 'required'){
						bindProps[key] = props[key]
					}
				}
				return bindProps
			}
		},
    methods: {
      checkValue(){
				let value = this.editor.value
				let type = this.editor.type
        let rules = this.editor.rules
        let status = null
        let message = ''
        for(let key in rules){
					if(key === 'required' && type === 'number'){
						break
					}
          let check = rules[key]['validator'](value,this.editor)
          if(!check){
            status = 'error'
            message = rules[key]['message']
            break
          }
        }
        this.$set(this.editor.validate,'status',status)
        this.$set(this.editor.validate,'message',message)
      },
      getPopupContainer(node){
        return node.parentNode || document.body
      },
      switchText(options,isOpen){
        let valueField = options['valueField'] || 'id'
        let textField = options['textField'] || 'text'
        let data = options.data || []
        let obj = data.find(item=>{
          return (isOpen && item[valueField]) || (!isOpen && !item[valueField])
        })
        return obj ? obj[textField] : ''
      },
      getFormat() {
				let type = this.editor.type
        if (this.editor.format) {
          return this.editor.format
        }
        return this.timeType[type]
      },
      onChange(){
				let value = this.editor._value
				if(this.inputTypes.time.includes(this.editor.type)){
					value && (value = moment(value).format(this.getFormat()))
				}
				this.$set(this.editor,'value',value)
        this.checkValue()
      },
      formatterValue(){
				let value = this.editor.value
				let type = this.editor.type
        if(this.inputTypes.time.includes(type)){
					value = value?moment(value,this.getFormat()):null
        }else if(this.inputTypes.switch.includes(type)){
					value = Boolean(value)
				}else if(this.inputTypes.number.includes(type)){
					value = value || 0
				}
				this.$set(this.editor,'_value',value)
				//类型检测，如设置number输入框，value为空，设置了switch，value为0
				let numberCheck = type === 'number' && typeof(this.editor.value) != 'number' && !this.editor.value
				let booleanCheck = type === 'switch' && typeof(this.editor.value) != 'boolean' && !this.editor.value
				if(numberCheck || booleanCheck){
					this.$set(this.editor,'value',value)
				}
      }
    }
  }
</script>