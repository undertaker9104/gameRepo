<template>
  <div>
    <h1>管理員列表</h1>
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="240"></el-table-column>
      <el-table-column prop="username" label="分類名稱"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="$router.push(`/admin_users/edit/${scope.row._id}`)"
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
      const res = await this.$http.get("rest/admin_users");
      this.items = res.data;
    },
    async remove(row) {
      this.$confirm(`是否確定要刪除管理員 "${row.username}"`, "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        await this.$http.delete(`rest/admin_users/${row._id}`);
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