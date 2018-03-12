from breezecore import models as m

def test_get_normal_title():
    assert m.Page.get_normal_title('Abc') == 'abc'
    assert m.Page.get_normal_title('Abc Abc') == 'abc_abc'
    assert m.Page.get_normal_title(' Abc Abc ') == 'abc_abc'
    assert m.Page.get_normal_title(' Абв Абв ') == 'абв_абв'
    assert m.Page.get_normal_title(' Абв ---> Абв ') == 'абв___абв'
