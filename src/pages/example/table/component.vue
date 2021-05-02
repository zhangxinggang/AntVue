<template>
	<div>
		<h1>输入框</h1>
		<editor-panel :columns="inputs" formLayout="horizontal" :labelStyle="{maxWidth:'200px'}">
			<template slot="statusTitle">
				自定义title
			</template>
		</editor-panel>
	</div>
</template>

<script>
	import EditorPanel from '@/components/table/advance/EditorPanel.vue'
	export default {
	  components: {EditorPanel},
		data() {
		  return {
		    inputs: [{
					title: '输入框',
					editor : {
						type: "textarea",
						props: {
							placeholder:'请输入账号',
							required:true
						}
					}
				},{
					title: "下拉框",
					slots: {title: 'statusTitle'},
					editor:{
						type:"select",
						props:{
							required:true
						},
						options:{
							valueField:"value",
							textField:"title",
							data:[{
								value:1,
								title:'已下单'
							},{
								value:2,
								title:'已付款'
							},{
								value:3,
								title:'已审核'
							},{
								value:4,
								title:'已发货'
							}]
						}
					}
				},{
					title: "树形下拉框",
					editor:{
						type:"treeSelect",
						props:{
							required:true,
							treeDefaultExpandAll:true
						},
						options:{
							valueField:"value",
							textField:"title",
							data:[{
								title: 'Node1',
								value: '0-0',
								children: [{
										value: '0-0-1'
									},{
										title: 'Child Node2',
										value: '0-0-2',
									}
								]
							},{
								title: 'Node2',
								value: '0-1',
							}]
						}
					}
				},{
					title: '开关',
					editor:{
						type:"switch",
						priority: 2,
						options:{
							valueField:"value",
							textField:"title",
							data:[{
								value:true,
								title:'开'
							},{
								value:false,
								title:'关'
							}]
						}
					}
				},{
					title: '时间',
					editor:{
						type:"date",
						format:"YYYY-MM-DD HH",
						props:{
							required:true
						}
					}
				},{
					title: '数字',
					editor : {
						type: "number",
						priority: 1,
						value:'',
						props: {
							placeholder:'请输入Character',
							maxLength:10,
							required:true
						}
					}
				}]
			}
		},
		mounted(){
			setTimeout(()=>{
				this.inputs.push({
					title: '数字2222222222222222222222222222222',
					editor : {
						type: "number",
						priority: 1,
						value:'',
						props: {
							placeholder:'请输入Character',
							maxLength:10,
							required:true,
							maxWidth:'100px'
						}
					}
				})
			},2000)
		}
	}
</script>