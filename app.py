import os
from flask import Flask, render_template, session

def create_app(test_config=None):
    # 创建 app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'
    
    from equipment import get_eq_list, get_eq_nums
    @app.route('/home')
    def home():
        eq_nums, eq_status = get_eq_nums()
        current_username = session.get('username')  # 获取当前登录用户的用户名
        return render_template('index.html', eq_list=get_eq_list(), current_username=current_username, eq_nums=eq_nums, eq_status=eq_status)
    
    # 数据库
    import db
    db.init_app(app)
    
    # 登录注册蓝本
    import auth
    app.register_blueprint(auth.auth_bp)
    
    import admin
    app.register_blueprint(admin.admin_bp)
    
    import equipment
    app.register_blueprint(equipment.eq_bp)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(app=app, host='127.0.0.1', port='5500')
