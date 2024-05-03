import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from werkzeug.security import check_password_hash, generate_password_hash

from db import get_db

eq_bp = Blueprint('equipment', __name__)


status_map = {
    0: '停止',
    1: '启动'
}

@eq_bp.route('/equipment')
def equipment():
    current_username = session.get('username')
    db = get_db()
    eq_list = db.execute('SELECT * FROM equipment').fetchall()
    q_nums, _ = get_eq_nums()
    return render_template('equipment.html', eq_list=eq_list, 
                           status_map=status_map, 
                           current_username=current_username,
                           eq_nums = q_nums)

@eq_bp.route('/eq_status', methods=['POST'])
def eq_status():
    if request.method == 'POST':
        eq_id = int(request.form['eq_id'])
        new_status = int(request.form['new_status'])
        db = get_db()
        db.execute('UPDATE equipment SET status = ? WHERE id = ?', (new_status, eq_id))
        db.commit()
        return redirect(url_for('equipment.equipment'))

@eq_bp.route('/add_eq', methods=['POST'])
def add_eq():
    if request.method == 'POST':
        eq_name = request.form['eq_name']
        add_eq_num = int(request.form['eq_num'])
        # 修改数据库中的库存 account 就行
        db = get_db()
        eq = db.execute('SELECT account FROM equipment where name = ?', (eq_name,)).fetchone()
        or_eq_account = eq['account']
        new_eq_account = or_eq_account + add_eq_num
        
        db.execute('UPDATE equipment SET account = ? WHERE name = ?', (new_eq_account, eq_name))
        db.commit()
        return redirect(url_for('equipment.equipment'))
        

@eq_bp.route('/delete_ep', methods=['POST'])
def delete_eq():
    if request.method == 'POST':
        eq_name = request.form['eq_name']
        del_eq_num = int(request.form['eq_num'])
        db = get_db()
        eq = db.execute('SELECT account FROM equipment where name = ?', (eq_name,)).fetchone()
        or_eq_account = eq['account']
        new_eq_account = or_eq_account - del_eq_num
        db.execute('UPDATE equipment SET account = ? WHERE name = ?', (new_eq_account, eq_name))
        db.commit()
        return redirect(url_for('equipment.equipment'))

 
def get_eq_list():
    db = get_db()
    eq_list = db.execute('SELECT * FROM equipment').fetchall()
    return eq_list


def get_eq_nums():
    db = get_db()
    eq_list = db.execute('SELECT * FROM equipment').fetchall()
    eq_nums = {}
    eq_status = {}
    for eq in eq_list:
        eq_nums[eq['name']] = eq['account']
        eq_status[eq['name']] = eq['status']
    return eq_nums, eq_status

@eq_bp.route('/get_eq_data')
def get_eq_data():
    eq_nums, eq_status = get_eq_nums()  # 假设你有一个函数从数据库中获取这些数据
    return jsonify(eq_nums=eq_nums, eq_status=eq_status)
