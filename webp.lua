local command
command = "convert " ..ngx.var.request_filepath.. " " ..ngx.var.request_filepath..ngx.var.ext

os.execute(command)
ngx.exec(ngx.var.request_uri)