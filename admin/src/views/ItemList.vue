<template>
  <div>
    <h1>物品列表</h1>
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="240"></el-table-column>
      <el-table-column prop="name" label="物品名稱"></el-table-column>
      <el-table-column prop="icon" label="圖片">
        <template slot-scope="scope">
          <img :src="scope.row.icon" style="height:3rem;" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="$router.push(`/items/edit/${scope.row._id}`)"
          >編輯</el-button>
          <el-button type="text" size="small" @click="remove(scope.row)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
export default {
  data() {
    return {
      items: []
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get("rest/items");
      this.items = res.data;
    },
    async remove(row) {
      this.$confirm(`是否確定要刪除物品 "${row.name}"`, "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        await this.$http.delete(`rest/items/${row._id}`);
        this.$message({
          type: "success",
          message: "刪除成功"
        });
        this.fetch();
      });
    }
  },
  created() {
    this.fetch();
  }
};
</script>